import uuid from 'uuid';

const actions = {
  createRow: () => ({
    type: 'CREATE_ROW',
    row: { name: 'John Doe', id: uuid.v4() }
  }),
  deleteRow: id => ({
    type: 'DELETE_ROW',
    row: { id }
  }),
  editRow: (id,name,address,abbrev,rows) => ({
    type: 'EDIT_ROW',
    row: {id,name,address,abbrev,rows}
  }),
  confirmEdit: (property, value, id) => ({
    type: 'CONFIRM_EDIT',
    row: { property, value, id }
  })
};


export default actions;