import React,{ useState, useEffect } from 'react'
import { Card, Col, Row,Button, Form, type FormProps, Input,Select,Pagination  } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { EditOutlined, EllipsisOutlined, SettingOutlined,DeleteOutlined } from '@ant-design/icons';

interface FieldType {
  name?: string;
  type?: string;
};

interface paginationConfig {
  current: number,
  pageSize: number,
  total: number
}

const Project: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<API.IProjectRes['data']>([])
  const [pageOption, setPageOption] = useState<paginationConfig>({
    current: 1,
    pageSize:4,
    total: 0
  })
  const projectDetele =(res: any) => {
    const id = res.id
    fetch('http://localhost:3000/api/project',{
        method: "delete",
        body: JSON.stringify({
          id
        }),
        headers: {
          'Content-Type': 'application/json'
          }
      }).then(res => res.json())
      .then(ele => { // 服务器返回给客户端的数据
        projectData()
      }).catch(error => {
        return error
      })
  }
  const projectData =(res:FieldType={},pageInfo:paginationConfig = pageOption) => {
    let url = `http://localhost:3000/api/project?size=${pageInfo.pageSize}&page=${pageInfo.current}`
    Object.entries(res).filter(ele => ele[1]).forEach((item,index) => {
      if (item[1]) {
        url += `&${item[0]}=${item[1]}`
      }
    })
    fetch(url,{
      method: "get",
    }).then(res => res.json())
    .then(ele => { // 服务器返回给客户端的数据
      setData(ele.data.list)
      setPageOption({
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
        total: ele.data.total,
      })
    }).catch(error => {
      return error
    })
  }
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    projectData(values)
  };
  useEffect( () => {
    projectData()
  }, []);
  return ( 
    <>
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item<FieldType>
            label="项目名称"
            name="name"
            rules={[{ required: false, message: '' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType>
            label="项目类型"
            name="type"
            rules={[{ required: false, message: '' }]}
          >
            <Select
              allowClear
              options={[
                { value: '1', label: 'H5' },
                { value: '2', label: 'App' },
                { value: '3', label: '小程序' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Col>
      </Row>
      
    </Form>
    <Button style={{marginBottom:'24px'}} type="primary" onClick={() => {navigate(`/project/detail`)}}>新增</Button>
    <Row gutter={16}>
    {
    data.map((res:any,index:any) => {
      return(
        <Col span={6}>
          <Card 
            hoverable
            title={res.name}
            onClick={() => navigate(`/monitor?projectId=${res.id}`)}
            actions={[
              // <SettingOutlined key="setting"/>,
              <EditOutlined key="edit" onClick={(e) => {e.stopPropagation();navigate(`/project/detail?id=${res.id}`)}}/>,
              <EllipsisOutlined key="ellipsis" onClick={(e) => {e.stopPropagation();navigate(`/monitor?projectId=${res.id}`)}}/>,
              <DeleteOutlined key="delete" onClick={(e) =>{ e.stopPropagation();projectDetele(res)}} />
            ]}
          >
            <div >
              <p>项目负责人：{res.owner}</p>
              <p>监控数量：{res.monitorCount}</p>
              <p>项目类型：{res.type}</p>
            </div>
          </Card>
        </Col>
      ) 
    })
    }
    </Row>
    <Pagination style={{marginTop:'24px',float:'right'}} defaultCurrent={pageOption.current} total={pageOption.total} pageSize={pageOption.pageSize} onChange={(current: number, size:number) => projectData( {},{...pageOption,current})} />
    </>
  )
}
 

export default Project