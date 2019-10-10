import React, { PureComponent } from 'react';
import { Button, Input } from 'antd';
import rpcCall from 'nkn-client/lib/rpc';
import nknWallet from 'nkn-wallet';
import NKN from './nkn';
import Sliding from './components/ SlidingTabs';
// import { connect } from 'dva';
const wallet = nknWallet.newWallet('password');

const nknClient = new NKN({
    wallet: wallet,
    username: "laolitou@qq.com"
});

nknClient.on('connect', ()=>{
    nknClient.on('message', (src, payload, payloadType, encrypt) => {
        console.log( payloadType + 'Receive', encrypt ? 'encrypted' : 'unencrypted',  'message', '"' + payload + '"','from', src, 'afterms');
        let reg = /^[\'\"]+|[\'\"]+$/g;
        let str = "";
        str = payload.replace(reg,"");
        let receive = str.split('.');
       
        if(!localStorage.getItem('localmsg')){
            let localmsg = {};
            let arr2 = [];
            arr2.push({
                username: src,
                msg: receive[0]
            })
            localmsg[receive[1]] = arr2;
            localStorage.setItem('localmsg', JSON.stringify(localmsg));
        }else{
            let localmsg = JSON.parse(localStorage.getItem('localmsg'));
            if(localmsg[receive[1]] !== undefined ){
                localmsg[receive[1]].push({
                    username: src,
                    msg: receive[0]
                })
            }else{
                let arr2 = [];
                arr2.push({
                    username: src,
                    msg: receive[0]
                })
                localmsg[receive[1]] = arr2;
            }
            localStorage.setItem('localmsg', JSON.stringify(localmsg));
        }
        return 'Well received!';
    });
});



class Shop extends PureComponent{
    state = {
        currentTopic: "opop",
        message: "",
        localmsg: JSON.parse(localStorage.getItem('localmsg')) || {}
    }

    handleChangeTopic = (topic) => {
        this.setState({
            currentTopic: topic
        })
    }

    subsrcibe = () => {
        console.log('subsrcibe')
        const { currentTopic } = this.state;
        const subinfo = nknClient.defaultClient.getSubscription(currentTopic, nknClient.addr);
        const latestBlockHeight = rpcCall(
            'http://mainnet-seed-0001.nkn.org:30003',
            'getlatestblockheight',
        );

        Promise.all([subinfo,latestBlockHeight]).then(([info, blockheight])=>{
        if(info.expiresAt - blockheight > 50000){
            return Promise.reject('Too soon.');
        }else{
            nknClient.subscribe(currentTopic).then((data)=>{
                console.log(data + "sub in default is success");
            });  
        }
        });
    };

    sendToTopic = () => {
        const { currentTopic, message } = this.state;
        const newMsg = `${message}.${currentTopic}`;
        console.log('fasong')
        nknClient.publishMessage(currentTopic, newMsg);
    }

    handleChange = (e) => {
        this.setState({
            currentTopic: e.target.value
        })
    }

    handleChange2 = (e) => {
        this.setState({
            message: e.target.value
        })
    }

    render() {
        const { channels, localmsg, currentTopic } = this.state;
        return(
            <div style={{height: "100%", width: "100%", background: "#fff"}}>
                <InputCon name="订阅" width="200px" method={this.subsrcibe} method2={this.handleChange}/>
                <Sliding channels={channels} localmsg={localmsg} handleChangeTopic={this.handleChangeTopic}/>
                <InputCon name="发送" method={this.sendToTopic} method2={this.handleChange2}/>
            </div>
        )
    }
}

export default Shop;

function InputCon({name, width, method, method2 }){
    return(
        <div style={{width, display: "flex"}}>
            <Input type="text" onChange={method2}/>
            <Button type="primary" onClick={method}>{name}</Button>
        </div>
    )
}