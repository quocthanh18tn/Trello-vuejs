<template>
  <div class="column"
      draggable
      @drop="moveTaskOrColumn($event, column.tasks, columnIndex)"
      @dragover.prevent
      @dragenter.prevent
      @dragstart.self="pickUpColumn($event, columnIndex)"

  >
    <div class="flex items-center mb-2 font-bold">
      {{column.name}}
    </div>
    <div class="list-reset">
      <ColumnTask
      v-for="(task,$taskIndex) in column.tasks"
      :key="$taskIndex"
      :task="task"
      :taskIndex="$taskIndex"
      :column="column"
      :columnIndex="columnIndex"
      :board="board"
      />
      <input type="text" class="block p-2 w-full bg-transparent"
            placeholder="+ Enter new task" @keyup.enter="createTask($event, column.tasks)"
      />
    </div>

    <!-- button delete column -->
   <button class="button-new" @click="deleteColumn(columnIndex)">Delete</button>
  </div>
</template>

<script>
import ColumnTask from '@/components/ColumnTask'

export default {
  components: {
    ColumnTask
  },
  props: {
    column: {
      type: Object,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    },
    board: {
      type: Object,
      required: true
    }
  },
  methods: {
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
    pickUpColumn (e, fromColumnIndex) {
      // console.log('pickupcolumn nha')
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'

      e.dataTransfer.setData('from-column-index', fromColumnIndex)
      e.dataTransfer.setData('type', 'column')
    },
    createTask (e, tasks) {
      this.$store.commit('CREATE_TASK', {
        tasks,
        name: e.target.value
      })
      e.target.value = ''
    },
    deleteColumn (columnIndex) {
      this.$store.commit('DELETE_COLUMN', columnIndex)
      this.$router.push({ name: 'board' })
    }
  }
}
</script>

<style scoped>
.column {
  @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
  min-width: 350px;
}

.button-new {
  color: black;
  border-radius: 10px;
  margin: 2px;
  padding: 10px;
  background-color: lightblue;
}
</style>
