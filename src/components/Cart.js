import React, { Component } from 'react';
import formatCurrency from '../util';
import { Fade, Zoom } from 'react-reveal';
import { connect } from 'react-redux';
import { removeFromCart } from '../actions/cartActions';
import { createOrder, clearOrder } from '../actions/orderActions';
import ReactModal from 'react-modal';

class Cart extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            email: "",
            address: "",
            showCheckOut: false
        }
    }

    handleInput = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    createOrder = (e) => {
        e.preventDefault();

        const order = {
            name: this.state.name,
            email: this.state.email,
            address: this.state.address,
            cartItems: this.props.cartItems,
            total: this.props.cartItems.reduce((a,c) => (a + c.price * c.count), 0)
        }

        this.props.createOrder(order);
    }

    closeModal = () => {
        this.props.clearOrder();
    }

    render() {
        const {cartItems, order} = this.props;

        return (
            <div>
                {cartItems.length === 0 ? <div className='cart cart-header'> Cart is Empty </div> :
                    <div className='cart cart-header'> You have {cartItems.length} in the cart </div>
                }

                {
                    order && 
                    <ReactModal isOpen={true} onRequestClose={this.closeModal}>
                        <Zoom>
                            <button className='close-modal' onClick={this.closeModal}> x </button>
                            <div className='order-details'>
                                <h3 className='success-message'>Your order has been placed</h3>
                                <h2> Order : {" " + order._id} </h2>
                                <ul>
                                    <li>
                                        <div> Name : </div>
                                        <div> {order.name} </div>
                                    </li>
                                    <li>
                                        <div> Email : </div>
                                        <div> {order.email} </div>
                                    </li>
                                    <li>
                                        <div> Address : </div>
                                        <div> {order.address} </div>
                                    </li>
                                    <li>
                                        <div> Date : </div>
                                        <div> {order.createdAt} </div>
                                    </li>
                                    <li>
                                        <div> Total : </div>
                                        <div> {formatCurrency(order.total)} </div>
                                    </li>
                                    <li>
                                        <div> Cart Items : </div>
                                        <div> 
                                            {order.cartItems.map(x => (
                                                <div className='items'> {x.count + " x " + x.title} </div>
                                            ))} 
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Zoom>
                    </ReactModal>
                }

                <div>
                    <div className='cart'>
                        <Fade left cascade>
                            <ul className='cart-items'>
                                {cartItems.map(item => (
                                    <li key={item._id}>
                                        <div>
                                            <img src={item.image} alt={item.title} />
                                        </div>

                                        <div>
                                            <div> {item.title} </div>
                                            <div className='right'>
                                                {formatCurrency(item.price)} x {item.count + " "}
                                                <button className='button' onClick={() => this.props.removeFromCart(item)}>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Fade>
                    </div>
                    {cartItems.length !== 0 && (
                        <div>
                            <div className='cart'>
                                <div className='total'>
                                    <div>
                                        Total: {" "}
                                        {formatCurrency(cartItems.reduce((a,c) => a + c.price * c.count, 0))}
                                    </div>
                                    <button onClick={() => {this.setState({showCheckOut: true})}} className='button primary'> Proceed </button>
                                </div>
                            </div>
                            {this.state.showCheckOut && (
                                <Fade right cascade>
                                    <div className='cart'>
                                        <form onSubmit={this.createOrder}>
                                            <ul className='form-container'>
                                                <li>
                                                    <label> Email </label>
                                                    <input type='email' name='email' required onChange={this.handleInput}/>
                                                </li>
                                                <li>
                                                    <label> Name </label>
                                                    <input type='text' name='name' required onChange={this.handleInput}/>
                                                </li>
                                                <li>
                                                    <label> Address </label>
                                                    <input type='text' name='address' required onChange={this.handleInput}/>
                                                </li>
                                                <li>
                                                    <button className='button primary' type='submit'> Checkout </button>
                                                </li>
                                            </ul>
                                        </form>
                                    </div>
                                </Fade>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        order: state.order.order,
        cartItems: state.cart.cartItems
    }),
    {removeFromCart, createOrder, clearOrder}
)(Cart);