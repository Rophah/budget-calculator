import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert';
// import uuid from 'uuid/v4';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

// const initialExpenses = [
//   { id: uuidv4(), charge: 'rent', amount: 1600 },
//   { id: uuidv4(), charge: 'car payment', amount: 400 },
//   { id: uuidv4(), charge: 'credit card bill', amount: 1200 }
// ]

const initialExpenses = localStorage.getItem('expenses')?JSON.parse(localStorage.getItem('expenses')) : [] ;
function App() {

  // ******************* State values***********************
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);

  // single amount

  const [ charge, setCharge ] = useState('');

  // single expense

  const [ amount, setAmount ] = useState('');

  //set alert

  const [ alert, setAlert ] = useState({ show: false});

  //set edit

  const [edit, setEdit] = useState(false);

  //edit item

  const [id, setId] = useState(0);

  // ******************* funtionality ******************
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  // ******************* funtionality ***********************
  //clearItems
  const clearItems = () => {
    setExpenses([]);
    handleAlert({type: 'danger', text: 'all items deleted'})
  }
  //handlecharge
  const handleCharge = e => {
    
    setCharge(e.target.value);
  }
  //handleamount
  const handleAmount = e => {
    
    setAmount(e.target.value);
  };

  //handlealert
  const handleAlert = ({type, text}) => {
    setAlert({show:true, type, text});
    setTimeout(() => {
      setAlert({show: false})}, 3000
    )
  }

  //handlesubmit
  const handleSubmit = e => {
    e.preventDefault();
    
    if(charge !== '' && amount > 0) {

      if (edit){
        let tempExpenses = expenses.map(item => {
          return item.id === id? {...item,amount,charge} : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({type: 'success', text:'item edited'});
      }else {
        const singleExpense = {id:uuidv4(), charge, amount}

        setExpenses([...expenses, singleExpense]);
        handleAlert({type:'success', text: 'item has been added'})
      }
      setAmount(''); 
      setCharge('');
    }else{
      //handle alert called
      handleAlert({
        type:'danger', 
        text: `charge cannot be empty and amount has to be greater than zero`});
    }
  };

  //handleDelete
  const handleDelete = id => {
    let tempExpenses = expenses.filter(item => item.id !== id); 
    setExpenses(tempExpenses);
    handleAlert({ type:'danger', text: 'item deleted' })
  };

  //handleEdit
  const handleEdit = id => {
    let expense = expenses.find(item => item.id === id);
    let {charge, amount} = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <div>
      {alert.show && <Alert type={alert.type} text= {alert.text} />}
      <Alert />

      <h1>Budget Calculator</h1>
      <main className='App'>
        <ExpenseForm 
          charge={charge} 
          amount = {amount} 
          handleAmount={handleAmount} 
          handleCharge={handleCharge} 
          handleSubmit={handleSubmit}
          edit ={edit}
        />
        <ExpenseList 
          expenses= {expenses}
          clearItems = {clearItems}
          handleDelete = {handleDelete}
          handleEdit = {handleEdit}
        />
      </main>
      <h1>
        total spending : { ' ' } <span className='total'>
          $ {' '}
          
          {expenses.reduce((acc, curr) => { 
            return (acc += parseInt(curr.amount)); 
          }, 0)}
        </span>
      </h1>
    </div>
  );
}

export default App;
