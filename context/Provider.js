import React, { useState, useEffect } from 'react';
import {ProductContext} from './Context';
import Client from '../connect-shopify';

const Provider = ({children}) => {

    const [productsList, setProducts] = useState([])
    const [product, setProduct] = useState([])
    const [productImage, setProductImage] = useState("")
    const [price, setPrice] = useState("")
    const [checkoutId, setCheckoutId] = useState("")
    const [updatedCheckout, setCheckout] = useState([])

    //Cart specific info

    const [totalProductQuantity, setTotalProductQuantity] = useState("")

    // product to checkout info

    const [variantId, setVariantId] = useState("")
    const [quantity, setQuantity] = useState("")

    const lineItemsToAdd = [
        {
            variantId: variantId,
            quantity: quantity,
        }
        ];

    const createCheckout = () => {
        Client.checkout.create().then((checkout) => {
            setCheckoutId(checkout.id)
            console.log(checkout)
        });
    }
    const updateCheckout = () => {
        Client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
            setCheckout(checkout)
            
                checkout.lineItems.map((item, i) => {
                   console.log(totalProductQuantity)
                   setTotalProductQuantity(prevState => prevState + 1)
                })
            
        });
    }

    const getCheckout = (checkoutId) => {
        Client.checkout.fetch(checkoutId).then((checkout) => {
            setCheckout(checkout)
        });
    }

    const getProduct = id => {
        Client.product.fetch(id)
        .then((product) => {
            setVariantId(product.variants[0].id)
            setProduct(product), 
            setProductImage(product.images[0].src),
            setPrice(product.variants[0].price) 
        })

    }

    const getAllProducts = () => {
        Client.product.fetchAll()
        .then((product) => {setProducts(product) })
    }

	useEffect(() => {
            createCheckout()
            getAllProducts()
        }, []);


        return (
            <ProductContext.Provider 
                value={{
                    totalProductQuantity,
                    setVariantId,
                    variantId,
                    setQuantity,
                    createCheckout,
                    updateCheckout,
                    getCheckout,
                    productsList, 
                    product, 
                    getProduct, 
                    productImage,
                    price
                }} 
            >
                {children}
            </ProductContext.Provider>
        );
    }



export default Provider;