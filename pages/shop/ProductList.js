import React, { useState } from 'react';
import { 
    Table,
    Button, 
    Divider, 
    Modal,
    Form,
    Input,
    Tooltip,
    Icon,
    Select,
    Upload,
    message,
    Popconfirm
 } from 'antd';

const { Option } = Select;
 

export default (props)=>{
    const { dataSource, visible, handleOk, handleCancel, showModal, handleDelete, wrapRef, formRef, handleEdit, title, id } = props;
    const [imgUrl,setImgUrl] = useState('');
    function submit(){
        formRef.current.validateFields((err,value)=>{
           if(!err){
                handleGetImg();
                const info = {...value,img: imgUrl, id: id? id:  Date.now() };
                handleOk(info);
           }
        })
    }
    function handleGetImg(img){
        setImgUrl(img)
    }

    const columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '是否优惠',
            dataIndex: 'isHot',
            render: (_,record)=>{
                const { isHot } = record;
                return isHot? '是': '否'
            }
        },
        {
            title: '图片',
            dataIndex: 'img',
            key: 'img',
            render: (_,{ img })=>{
                return <img src={img} alt="logo" style={{
                    height: '3rem',
                    width: "3rem"
                }}/>
            }
        }, 
        {
            title: 'operation',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, {id})=>{
                return (
                    <div>
                         <Popconfirm
                            title="确定要下架该商品?"
                            onConfirm={()=>handleDelete(id)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="danger" size="small" >下架该商品</Button>
                        </Popconfirm>
                        <Divider type="vertical"/>
                        <Button type="primary" size="small" onClick={()=>handleEdit(id)}>编辑该商品</Button>
                    </div>
                )
            }
        }, 
    ]; 

    return(
        <>
             <Button type="primary" style={{
                 marginBottom: "1rem"
             }} onClick={()=>showModal('add')}>上架商品</Button>
             <Modal
                title={title}
                visible={visible}
                onOk={submit}
                onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
             >
             <WrappedRegistrationForm getImg={handleGetImg} ref={formRef} wrapRef={wrapRef}/>
             </Modal>
             <Table dataSource={dataSource} columns={columns} rowKey="id"/>
        </>
    )
}

class RegistrationForm extends React.Component {  
    render() {
      const { getFieldDecorator } = this.props.form;
  
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };

      return (
        <Form {...formItemLayout}>
          <Form.Item label="商品名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入商品名称',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="商品价格">
            {getFieldDecorator('price', {
              rules: [
                {
                  required: true,
                  message: '请输入商品名称',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                是否优惠&nbsp;
                <Tooltip title="该商品是否优惠?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('isHot', {
              initialValue: 1,
              rules: [{ required: true, message: '请选择是否优惠'}],
            })( 
            <Select style={{ width: 120 }} onChange={handleChange}>
            <Option value={1}>是</Option>
            <Option value={0}>否</Option>
          </Select>)}
          </Form.Item>
          <Form.Item label="商品图片">
            {getFieldDecorator('img', {
              rules: [
                {
                  message: '请选择商品图片',
                },
              ],
            })(<Avatar getImg={this.props.getImg} ref={this.props.wrapRef}/>)}
          </Form.Item>
        </Form>
      );
    }
  }

  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  
  class Avatar extends React.Component {
    state = {
      loading: false,
    };

    clearState = ()=>{
        this.setState({
            loading: false,
            imageUrl: null
        })
    }

    setImg = (imageUrl) => {
      this.setState({
        imageUrl
      })
    }
  
    handleChange = info => {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrl,
            loading: false,
          },()=>{
              this.props.getImg(this.state.imageUrl)
          }),
        );
      }
    };
  
    render() {
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const { imageUrl } = this.state;
      return (
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      );
    }
  }
  
  const WrappedRegistrationForm = Form.create({ name: 'productOperation' })(RegistrationForm);  