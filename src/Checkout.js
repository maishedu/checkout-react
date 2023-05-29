import React from "react";
import {useState, useEffect,useMemo} from "react";
import styles from './Checkout.module.css';
import { LoadingIcon } from './Icons';
import { getProducts } from './dataService';

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places



const Product = ({ id, name, availableCount, price, orderedQuantity, total,add,remove }) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>   
      <td>${total.toFixed(2)}</td>
      <td>
        <button className={styles.actionButton} onClick={add} disabled={availableCount<=orderedQuantity?true:false}>+</button>
        <button className={styles.actionButton} onClick={remove} disabled={orderedQuantity<=0?true:false}>-</button>
      </td>
    </tr>    
  );
}


const Checkout = () => {
    const [loading,setLoading] = useState(true);
    const [products,setProducts] = useState([]);
    const [discount,setDiscount]=useState(false);

    useEffect(()=>{
        getProducts().then((data)=>{
            const updatedData = data.map((product)=>{
                return {...product,quantity :0}
            });
            setProducts(updatedData);
            setLoading(false);
        })
    },[]);
    const total = (data)=>{
        const totals = data.map((product)=>product.price * product.quantity)
        const sum  = totals.reduce((accumulator, value) => {
             return accumulator + value;
         }, 0);
        if (sum > 1000){
            setDiscount(true);
            return sum * 0.9;
        }else {
            setDiscount(false);
            return sum;
        }

    }
    const netTotal = useMemo(()=>total(products),[products]);

    const add = (id)=>{
        const updatedProduct = products.map((data)=>{
            if (data.id == id){
                return {...data,quantity:data.quantity +1}
            }
            return data;
        })
        setProducts(updatedProduct);
    }
    const remove = (id)=>{
        const updatedProduct = products.map((data)=>{
            if (data.id == id){
                return {...data,quantity:data.quantity -1}
            }
            return data;
        })
        setProducts(updatedProduct);
    }
    return (
    <div>
      <header className={styles.header}>        
        <h1>Electro World</h1>        
      </header>
      <main>
          {loading ? <LoadingIcon /> :''}

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {
              products.map((data)=>{
              return (
                  <Product key={data.id} id={data.id} name={data.name} availableCount={data.availableCount} orderedQuantity={data.quantity} price={data.price} total={data.price*data.quantity}
                  add={()=>add(data.id)} remove={()=>remove(data.id)} />
              );
          })}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: ${discount ?(netTotal*10/90).toFixed(2):'0.00'} </p>
        <p>Total: $ {netTotal.toFixed(2)} </p>
      </main>
    </div>
  );
};

export default Checkout;