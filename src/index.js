
//import registerServiceWorker from './registerServiceWorker';

/* eslint-disable global-require, import/no-unresolved */
/*
import React from 'react';
import ReactDOM from 'react-dom';

import 'purecss/build/pure.css';
import 'sortabular/style.css';
import 'react-pagify/style.css';
import 'treetabular/style.css';
import 'react-visibility-toggles/style.css';
import '../packages/reactabular-resizable/style.css';

import documentation from './documentation';
import pages from './pages';

import './main.css';
import '../style.css';

// TODO: Doesn’t work in React 16 yet
// if (process.env.NODE_ENV !== 'production') {
//   React.Perf = require('react-addons-perf');
// }

*/

import React from 'react';
import ReactDOM from 'react-dom';
import 'purecss/build/pure.css';
import './main.css';
import './style.css';

import { createStore } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, findIndex } from 'lodash';
import * as Table from 'reactabular-table';
import * as edit from 'react-edit';
import uuid from 'uuid';
import actions from './actions';
import reducer from './reducer';
import initialState from './initialState';
import store from './configureStore';

//import { generateRows } from './helpers';


const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    abbrev: {
      type: 'string'
    }
    
  },
  required: ['id', 'address', 'name', 'abbrev']
};
/*
function editProperty(rows, index, values) {
  // Skip mutation, there's likely a neater way to achieve this
  const ret = cloneDeep(rows);

  Object.keys(values).forEach(v => {
    ret[index][v] = values[v];
  });

  return ret;
}
*/

//const store = createStore(reducer,initialState.theRows);
//console.log(generateRows(20,schema));

class CRUDTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(), // initial columns
      name:'',
      id:'',
      address:'',
      abbrev:'',
      showForm:false
    };

    this.handleName = this.handleName.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
    this.handleAbbrev = this.handleAbbrev.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  getColumns() {
    const editable = edit.edit({
      isEditing: ({ columnIndex, rowData }) => columnIndex === rowData.editing,
      onActivate: ({ columnIndex, rowData }) => {
        //this.props.editRow(columnIndex, rowData.id);

        this.setState({
          id:rowData.id,
          name:rowData.name,
          address:rowData.address,
          abbrev:rowData.abbrev,
          showForm:true
        },console.log(this.state));
        console.log('columnIndex on activate : ',columnIndex);
        console.log('rowData on activate : ',rowData);
      },
      onValue: ({ value, rowData, property }) => {
        this.props.confirmEdit(property, value, rowData.id);
        console.log('property :',property);
        console.log('value : ',value);

        debugger;
      }
    });

    return [
      {
        property: 'address',
        header: {
          label: 'Address'
        },
        cell: {
          transforms: [editable(edit.input())]
        }
      },
      {
        property: 'name',
        header: {
          label: 'Name'
        },
        cell: {
          transforms: [editable(edit.input())]
        }
      },
      {
        property: 'abbrev',
        header: {
          label: 'Abbrev'
        },
        cell: {
          transforms: [editable(edit.input({ props: { type: 'string' } }))]
        }
      },
      {
        property: 'active',
        header: {
          label: 'Active'
        },
        cell: {
          transforms: [editable(edit.boolean())],
          formatters: [active => active && <span>&#10003;</span>]
        }
      }
      
    ];
  }

  handleName(e){
    console.log(e.target.value);
    this.setState({
      name:e.target.value
    });
  }

  handleAddress(e){
    console.log(e.target.value);
    this.setState({
      address:e.target.value
    });
  }

  handleAbbrev(e){
    this.setState({
      abbrev:e.target.value
    });
  }

  submitData(e){
    e.preventDefault();
    this.setState({
      showForm:false
    })
    this.props.editFunc(this.state.id,this.state.name,this.state.address,this.state.abbrev,this.props.rows);
  }

  render() {
    const { rows } = this.props;
    const { columns } = this.state;
    debugger;
    return (
      <div>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns={columns}
        >
          <Table.Header />

          <tbody>
            <tr>
             {/* <td><button type="button" onClick={e => {
                e.preventDefault();

                this.props.createRow();
              }}>Add new</button></td> */}
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>

          <Table.Body rows={rows} rowKey="id" />
        </Table.Provider>
        {this.state.showForm?
        (<form>
        Address : <input type="text" name="address" value={this.state.address} onChange={this.handleAddress} /><br/>
       Name : <input type="text" name="name" value={this.state.name} onChange={this.handleName} /><br/>
       Abbrev : <input type="text" name="abbrev" value={this.state.abbrev} onChange={this.handleAbbrev} /><br/>
       <button type="submit" 
       onClick={this.submitData}
       >Submit</button>
        </form>):''}

      </div>
    );
  }
}

const mapStateToProps = state => ({
	rows:state
})

const mapDispatchToProps = dispatch => ({
	/*
  createRow:dispatch({
    type: 'CREATE_ROW',
    row: { name: 'John Doe', id: uuid.v4() }
  }),
  */
	editFunc : (id,name,address,abbrev,rows)=>dispatch(actions.editRow(id,name,address,abbrev,rows)),
	confirmEdit:(property, value, id) => dispatch({
    type: 'CONFIRM_EDIT',
    row: { property, value, id }
  })
})

const ConnectedCRUDTable = connect(mapStateToProps,mapDispatchToProps
)(CRUDTable);


ReactDOM.render(
<ConnectedCRUDTable store={store} />,
  document.getElementById('root')
);



