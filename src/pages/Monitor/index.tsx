import React,{ useState, useEffect } from 'react'
import { Card, Col, Row,Button, Form, type FormProps, Input,Pagination  } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DeleteOutlined ,EditOutlined} from '@ant-design/icons';

interface FieldType {
  name?: string;
  code?: string;
};

interface paginationConfig {
  current: number,
  pageSize: number,
  total: number
}

const Monitor: React.FC = () => {
  const navigate = useNavigate()
  const[ search] = useSearchParams();
  const projectId = search.get('projectId') || ''
  const [data, setData] = useState<API.coedeRes['data']>([])
  const [pageOption, setPageOption] = useState<paginationConfig>({
    current: 1,
    pageSize:4,
    total: 0
  })
  const codeDetele =(res: any) => {
    const codeId = res.id
    fetch('http://localhost:3000/api/code',{
        method: "delete",
        body: JSON.stringify({
          id:codeId
        }),
        headers: {
          'Content-Type': 'application/json'
          }
      }).then(res => res.json())
      .then(ele => { // 服务器返回给客户端的数据
        codeData()
      }).catch(error => {
        return error
      })
  }
  const codeData = (res:FieldType={},pageInfo:paginationConfig = pageOption) => {
    let url = `http://localhost:3000/api/code?projectId=${projectId}&size=${pageInfo.pageSize}&page=${pageInfo.current}`
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
    codeData(values)
  };
  useEffect(() => {
    codeData()
  }, []);
  return(
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
            label="监控名称"
            name="name"
            rules={[{ required: false, message: '' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType>
            label="状态码"
            name="code"
            rules={[{ required: false, message: '' }]}
          >
            <Input />
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
      <Button style={{marginBottom:'24px'}} type="primary" onClick={() => {navigate(`/monitor/detail?projectId=${projectId}`)}}>新增</Button>
      <Row gutter={16}>
      {
      data.map((res:any,index:any) => {
        return(
          <Col span={6}>
            <Card 
            hoverable
            title={res.name}
            onClick={() => navigate(`/detail?id=${res.id}`)}
            extra={<p>状态码：{res.code}</p>}
            actions={[
              // <SettingOutlined key="setting"/>,
              <EditOutlined key="edit" onClick={(e) => {e.stopPropagation();navigate(`/monitor/detail?projectId=${projectId}&id=${res.id}`)}}/>,
              <DeleteOutlined key="delete" onClick={(e) =>{ e.stopPropagation();codeDetele(res)}} />
            ]}
            >
              <p>今日数量：{res.countToday}</p>
              <p>昨日数量：{ res.countYesterday}</p>
            </Card>
          </Col>
        ) 
      })
      }
      </Row>
      <Pagination style={{marginTop:'24px',float:'right'}} defaultCurrent={pageOption.current} total={pageOption.total} pageSize={pageOption.pageSize} onChange={(current: number, size:number) => codeData( {},{...pageOption,current})} />
    </>
  )
}

export default Monitor