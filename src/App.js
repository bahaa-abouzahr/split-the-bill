import { useState, useEffect  } from "react";
import imageBahaa from "./images/bahaa.jpg";
import imageFadel from "./images/fadel.jpg";
import imageAfif from "./images/afif.jpg";

let initialFriends = [
  {
    id: 1,
    name: "Bahaa",
    image: imageBahaa,
    bills: [0],
    get balance() {
      return this.bills.reduce((a , b) => a + b, 0);
    }
    // balance: function(){
    //   return this.bills.reduce((a , b) => a + b, 0);
    // },
  },
  {
    id: 2,
    name: "Fadel",
    image: imageFadel,
    bills: [0],
    get balance() {
      return this.bills.reduce((a , b) => a + b, 0);
    }
  },
  {
    id: 3,
    name: "Afif",
    image: imageAfif,
    bills: [0],
    get balance() {
      return this.bills.reduce((a , b) => a + b, 0);
    }
  },
];

let xFlag = true;
let refreshFlag = true;

// localStorage.clear("friends");
// sessionStorage.clear("friends")

// function ParseFloat(str,val) {
//   str = str.toString();
//   str = str.slice(0, (str.indexOf(".")) + val + 1); 
//   return Number(str);   
// }

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

export default function App() {
  let friendsList;
  const storage = sessionStorage.getItem('friends');
  
  if(refreshFlag && storage) {
    friendsList = JSON.parse(storage);
    refreshFlag = false;
  }

  const [friends, setFriends] = useState(() => {
    const savedFriends = sessionStorage.getItem('friends');
    return savedFriends ? JSON.parse(savedFriends) : initialFriends;
  });

  useEffect(() => {
    sessionStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);


  function handleSplitBill(bahaa, fadel, afif) {

    friends[0].bills.push(bahaa);
    friends[1].bills.push(fadel);
    friends[2].bills.push(afif);

    setFriends(friends => 
      friends.map(friend => friend.id ? {...friend, balance: Math.round((friend.bills.reduce((a,b) => a + b, 0))* 1e2 ) / 1e2} : console.log("test"))
    )
  }

  function resetData() {
    localStorage.clear("friends");
    sessionStorage.clear("friends")
    window.location.reload();
  }

  return (
    <div className='app'>

      {<FormSplitBill onSplitBill={handleSplitBill} />}

      <div className='sidebar'>
        <FriendsList friends={friends} />
        <Button onClick={resetData}>Reset Data</Button>
      </div>
    </div>
  )
}

function FriendsList({ friends }) {
  return (
    <ul>
      {friends.map((friend) =>(
        <Friend 
          friend={friend} 
          key={friend.id} 
        />
      ))}
    </ul>
  )
}

function Friend({ friend }) {

  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      
      {friend.balance < 0 && (
        <p className="red">
          Should pay {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          should get back {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance === 0 && (
        <p>
          Even
        </p>
      )}
    </li>
  )
}


function FormSplitBill({ onSplitBill, saveData }) {
  const [bill, setBill] = useState("");
  const [paidByBahaa, setPaidByBahaa] = useState("");
  const [paidByAfif, setPaidByAfif] = useState("");
  const [paidByFadel, setPaidByFadel] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState('Bahaa')

  function initializeFormData() {
    setBill('');
    setPaidByBahaa('');
    setPaidByAfif('');
    setPaidByFadel('');
  }

  function handleSubmit(e) {
    e.preventDefault();

    if(!bill || !paidByBahaa || !paidByAfif || !paidByFadel) return;

    const convertedBill = parseFloat(bill);
    const convertedBahaa = parseFloat(paidByBahaa);
    const convertedFadel = parseFloat(paidByFadel);
    const convertedAfif = parseFloat(paidByAfif);

    const sumBills = convertedBahaa + convertedFadel + convertedAfif;

    if(convertedBill !== sumBills && xFlag) {
      console.log("wrong values");
      console.log(convertedBill, typeof(convertedBill));
      console.log(sumBills, typeof(sumBills));
      return;
    }

    if(whoIsPaying === 'Bahaa') onSplitBill(bill - convertedBahaa, -convertedFadel, -convertedAfif);
    else if(whoIsPaying === 'Fadel') onSplitBill(-convertedBahaa, convertedBill - convertedFadel, -convertedAfif)
    else if(whoIsPaying === 'Afif') onSplitBill(-convertedBahaa, -convertedFadel, convertedBill - convertedAfif);

    initializeFormData();

  }

  function handleSplit(number) {
    xFlag = false;

    if(number === 3){
      setPaidByBahaa(Math.round((parseFloat(bill / 3)) * 1e2 ) / 1e2);
      setPaidByFadel(Math.round((parseFloat(bill / 3)) * 1e2 ) / 1e2);
      setPaidByAfif(Math.round((parseFloat(bill / 3)) * 1e2 ) / 1e2);
    }
    else {
      setPaidByBahaa(Math.round((parseFloat(bill / 4)) * 1e2 ) / 1e2);
      setPaidByFadel(Math.round((parseFloat(bill / 4)) * 1e2 ) / 1e2);
      setPaidByAfif(Math.round((parseFloat(bill / 2)) * 1e2 ) / 1e2);
    }
    
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill</h2>
    
      <label>💰 Bill value</label>
      <input type="text" value={bill} onChange={(e) => setBill(e.target.value)} />

      <label>🧑 Bahaa bill</label>
      <input 
        type="text" 
        value={paidByBahaa} 
        onChange={(e) => 
          setPaidByBahaa(
            parseFloat(e.target.value) > parseFloat(bill) ? paidByBahaa : e.target.value)} 
      />

      <label>🧑 Fadel's bill</label>
      <input 
        type="text" 
        value={paidByFadel} 
        onChange={(e) => 
          setPaidByFadel(
            parseFloat(e.target.value) > parseFloat(bill) ? paidByFadel : e.target.value)} 
      />

      <label>🧑 Afif bill</label>
      <input 
        type="text" 
        value={paidByAfif} 
        onChange={(e) => 
          setPaidByAfif(
            parseFloat(e.target.value) > parseFloat(bill) ? paidByAfif : e.target.value)} 
      />


      <label>🤑 Who paid the bill</label>
      <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value='Bahaa'>Bahaa</option>
        <option value='Fadel'>Fadel</option>
        <option value='Afif'>Afif</option>
      </select>

      <div className="split-buttons">
        <button className="x3-x4-buttons" type="button" onClick={() => handleSplit(3)}>Split x3</button>
        <button className="x3-x4-buttons" type="button" onClick={() => handleSplit(4)}>Split x4</button>
      </div>
        <Button>Split bill</Button>
      
    </form>
  ) 
}