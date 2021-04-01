var id = 1

export function uuid () {
  return (id++).toString(16)
  // return Math.random().toString(16).slice(2)
}

export function saveStatePlugin (store) {
  store.subscribe(
    (mutation, state) => localStorage.setItem('board', JSON.stringify(state.board))
  )
}
