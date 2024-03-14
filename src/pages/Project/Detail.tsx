import React,{ useState, useEffect } from 'react'

import { Button, Form, type FormProps, Input,Select } from 'antd';
import { Link, useNavigate,useSearchParams} from 'react-router-dom';

type FieldType = {
  name?: string;
  owner?: string;
  type?: string;
};


const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const[ search] = useSearchParams();
  const id = search.get('id') || ''
  const [data, setData] = useState<FieldType>({})
  const [form] = Form.useForm();
  useEffect( () => {
    if (!id)return
    fetch('http://localhost:3000/api/project?id=' + id,{
      method: "get",
    }).then(res => res.json())
    .then(ele => { // 服务器返回给客户端的数据
      setData(ele.data)
      let  date = ele.data
      form.setFieldsValue({
        name: date.name,
        owner: date.owner,
        type: date.type,
      })
    }).catch(error => {
      return error
    })
  }, []);
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    let valuesData = id ? {...values,id: id } :{ ...values}
    fetch('http://localhost:3000/api/project',{
      method: id ?'put': "post",
      body: JSON.stringify(valuesData),
      headers: {
        'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(ele => { // 服务器返回给客户端的数据
      navigate('/project',{replace: true})
    }).catch(error => {
      return error
    })
  };
  return(
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="项目名"
        name="name"
        rules={[{ required: true, message: 'Please input your name!', }]}
      >
        <Input value={data.name} />
      </Form.Item>

      <Form.Item<FieldType>
        label="项目负责人"
        name="owner"
        rules={[{ required: true, message: 'Please input your owner!' }]}
      >
        <Input value={data.owner} />
      </Form.Item>
      <Form.Item<FieldType>
        label="项目类型"
        name="type"
        rules={[{ required: true, message: 'Please input your type!' }]}
      >
        <Select
          value={data.type}
          allowClear
          options={[
            { value: '1', label: 'H5' },
            { value: '2', label: 'App' },
            { value: '3', label: '小程序' },
          ]}
        />
      </Form.Item>
    

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          { id ? '修改' : '新增' }
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Detail