<template>
  <div class="board">
    <div class="flex flex-row items-start">
      <div class="column"
           v-for="(column,$columnIndex) in board.columns"
          :key="$columnIndex"
          draggable
          @drop="moveTaskOrColumn($event, column.tasks, $columnIndex)"
          @dragover.prevent
          @dragenter.prevent
          @dragstart.self="pickUpColumn($event, $columnIndex)"

      >
        <div class="flex items-center mb-2 font-bold">
          {{column.name}}
        </div>
        <div class="list-reset">
          <div class="task"
               v-for="(task,$taskIndex) in column.tasks"
               :key="$taskIndex"
               draggable
               @dragstart="pickUpTask($event, $taskIndex, $columnIndex)"
               @click="goToTask(task)"
               @dragover.prevent
               @dragenter.prevent
               @drop.stop="moveTaskOrColumn($event, column.tasks, $columnIndex, $taskIndex)"
          >
            <span class="w-full flex-no-shrink font-bold">
              {{ task.name }}
            </span>
            <p v-if="task.description" class="w-full flex-no-shrink text-sm mt-1">
              {{ task.description }}
            </p>
          </div>

          <input type="text" class="block p-2 w-full bg-transparent"
                 placeholder="+ Enter new task" @keyup.enter="createTask($event, column.tasks)"
          />
        </div>

        <!-- button delete column -->
      <button class="button-new" @click="deleteColumn($columnIndex)">Delete</button>

      </div>

      <div class="column flex">
        <input type="text"
          class="p-2 mr-2 flex-grow"
          placeholder="New column name"
          v-model="newColumnName"
          @keyup.enter="createColumn"
        />
      </div>

    </div>

    <div class="task-bg" v-if="isOpenTask" @click.self="close">
      <router-view/>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      newColumnName: ''
    }
  },
  computed: {
    ...mapState(['board']),
    isOpenTask () {
      return this.$route.name === 'task'
    }
  },
  methods: {
    goToTask (task) {
      this.$router.push({ name: 'task', params: { id: task.id } })
    },
    close () {
      this.$router.push({ name: 'board' })
    },
    createTask (e, tasks) {
      this.$store.commit('CREATE_TASK', {
        tasks,
        name: e.target.value
      })
      e.target.value = ''
    },
    createColumn () {
      this.$store.commit('CREATE_COLUMN', {
        name: this.newColumnName
      })
      this.newColumnName = ''
    },
    pickUpTask (e, taskIndex, fromColumnIndex) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'

      e.dataTransfer.setData('from-task-index', taskIndex)
      e.dataTransfer.setData('from-column-index', fromColumnIndex)
      e.dataTransfer.setData('type', 'task')
    },
    pickUpColumn (e, fromColumnIndex) {
      // console.log('pickupcolumn nha')
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'

      e.dataTransfer.setData('from-column-index', fromColumnIndex)
      e.dataTransfer.setData('type', 'column')
    },
    moveTaskOrColumn (e, toTasks, toColumnIndex, toTaskIndex) {
      const type = e.dataTransfer.getData('type')
      if (type === 'task') {
        this.moveTask(e, toTasks, toTaskIndex !== undefined ? toTaskIndex : toTasks.length)
      } else {
        this.moveColumn(e, toColumnIndex)
      }
    },
    moveTask (e, toTasks, toTaskIndex) {
      const fromColumnIndex = e.dataTransfer.getData('from-column-index')
      const fromTasks = this.board.columns[fromColumnIndex].tasks
      const fromTaskIndex = e.dataTransfer.getData('from-task-index')

      this.$store.commit('MOVE_TASK', {
        fromTasks,
        fromTaskIndex,
        toTasks,
        toTaskIndex
      })
    },
    moveColumn (e, toColumnIndex) {
      const fromColumnIndex = e.dataTransfer.getData('from-column-index')

      this.$store.commit('MOVE_COLUMN', {
        fromColumnIndex,
        toColumnIndex
      })
    },
    deleteColumn (columnIndex) {
      this.$store.commit('DELETE_COLUMN', columnIndex)
      this.$router.push({ name: 'board' })
    }
  }
}
</script>

<style lang="css">
.task {
  @apply flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-grey-darkest no-underline;
}

.column {
  @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
  min-width: 350px;
}

.board {
  @apply p-4 bg-teal-dark h-full overflow-auto;
}

.task-bg {
  @apply pin absolute;
  background: rgba(0,0,0,0.5);
}
.button-new {
  color: black;
  border-radius: 10px;
  margin: 2px;
  padding: 10px;
  background-color: lightblue;
}
</style>
