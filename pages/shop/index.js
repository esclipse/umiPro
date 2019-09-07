import React, { PureComponent } from 'react';
import ProductList from './ProductList';

export default class Shop extends PureComponent{
    constructor(){
        super();
        this.myRef = React.createRef();
        this.formRef = React.createRef();
        this.state = {
            shopList: [
                { id: "1", price: "100rmb", name: "西红柿炒鸡蛋", isHot: 0, img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
                { id: "2", price: "10rmb", name: "宫保鸡丁", isHot: 1, img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
            ]
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    
    handleOk = (info) => {
        this.myRef.current.clearState();
        this.formRef.current.resetFields();
        this.setState({
            visible: false,
            shopList: [...this.state.shopList,{...info,id: Date.now() }]
        });
    };

    handleDelete = (id) => {
        const cloneList = [...this.state.shopList]
        const index = cloneList.findIndex(v=>v.id===id);
        cloneList.splice(index,1);
        this.setState({
            shopList: cloneList
        })
    }

    // handleEdit = () => {}

    handleCancel = e => {
        this.myRef.current.clearState();
        this.formRef.current.resetFields();
        this.setState({
            visible: false,
        });
    };

    render() {
        const { shopList, visible } = this.state;
        const props = {
            dataSource: shopList,
            visible,
            handleOk: this.handleOk,
            handleCancel: this.handleCancel, 
            showModal: this.showModal,
            handleDelete: this.handleDelete,
            wrapRef: this.myRef,
            formRef: this.formRef
        }
        return(
            <div style={{
                background: "#fff",
                padding: '1rem'
            }}>
                <ProductList {...props} />
            </div>
        )
    }
}