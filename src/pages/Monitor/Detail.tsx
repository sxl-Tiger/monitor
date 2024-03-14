import React,{ useState, useEffect } from 'react'

import { Button, Form, type FormProps, Input } from 'antd';
import { Link, useNavigate,useSearchParams} from 'react-router-dom';

type FieldType = {
  name?: string;
  code?: number;
};


const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const[ search] = useSearchParams();
  const id = search.get('id') || ''
  const projectId = search.get('projectId')
  const [data, setData] = useState<FieldType>({})
  const [form] = Form.useForm();
  useEffect( () => {
    if (!id)return
    fetch(`http://localhost:3000/api/code?id=${id}`,{
      method: "get",
    }).then(res => res.json())
    .then(ele => { // 服务器返回给客户端的数据
      setData(ele.data[0])
      let  date = ele.data[0]
      form.setFieldsValue({
        name: date.name,
        code: date.code
      })
    }).catch(error => {
      return error
    })
  }, []);
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    let valuesData = id ? {...values,projectId,id } :{ ...values,projectId}
    fetch('http://localhost:3000/api/code',{
      method: id ?'put': "post",
      body: JSON.stringify(valuesData),
      headers: {
        'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(ele => { // 服务器返回给客户端的数据
      navigate('/monitor?projectId=' + projectId,{replace: true})
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
        label="监控接口名称"
        name="name"
        rules={[{ required: true, message: 'Please input your name!', }]}
      >
        <Input value={data.name} />
      </Form.Item>

      <Form.Item<FieldType>
        label="接口code"
        name="code"
        rules={[{ required: true, message: 'Please input your code!' }]}
      >
        <Input value={data.code} />
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