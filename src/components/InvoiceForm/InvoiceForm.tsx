import { useState } from "react";
import { Form, Input, Button, DatePicker, Select, Row, Col, Table } from "antd";
import './Invoice.css';
import dayjs from 'dayjs';
import  DeleteOutlined  from  '../../assets/trashIcon.svg';
import { useMutation, gql } from '@apollo/client';
import { customToast } from "../CustomToast";
// import { customToast } from "../CustomToast";

const { Option } = Select;


export const InvoiceForm = () => {
    const CREATE_INVOICE = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    id
    invoiceDate
    paymentTerms
    projectDescription
    billingTo {
      clientName
      clientEmail
      billingToAddress {
        streetAddress
        city
        country
        postalCode
      }
    }
    billingFrom {
      companyName
      companyEmail
      id
      billingFromAddress {
        streetAddress
        city
        country
        postalCode
      }
    }
    items {
    id
      name
      quantity
      price
      totalPrice
    }
    subTotal
    tax
    totalAmount
  }
}

`;
  
    interface Item {
        name: string;
        quantity: number;
        price: number;
        total: number;
      }
    
      interface InvoiceData {
        billFrom: Bill;
        billTo: Bill;
        invoiceDetails: InvoiceDetails;
        items: Item[];
      }
    
      interface Bill {
        companyName: string;
        email: string;
        address: string;
        country: string;
        city: string;
        postalCode: string;
      }
    
      interface InvoiceDetails {
        date: string;
        paymentTerms: string;
        projectDescription: string;
      }
    
      const initialBillState: Bill = {
        companyName: '',
        email: '',
        address: '',
        country: '',
        city: '',
        postalCode: '',
      };
    
      const initialInvoiceData: InvoiceData = {
        billFrom: initialBillState,
        billTo: initialBillState,
        invoiceDetails: {
          date: dayjs().format('DD MMM, YYYY'),
          paymentTerms: '',
          projectDescription: '',
        },
        items: [{ name: '', quantity: 0, price: 0, total: 0 }]
      };

    
      const [form] = Form.useForm();
      const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialInvoiceData);
      const [items, setItems] = useState<Item[]>(invoiceData.items);

    
      const handleAddItem = () => {
        setItems([...items, { name: '', quantity: 0, price: 0, total: 0 }]);
        setInvoiceData({ ...invoiceData, items });
      };
    
      const paymenntTermsEnums = [
        {id:1, value:"NET_10_DAYS" , label :"Net 10 Days"},
        {id:2, value:"NET_20_DAYS" , label :"Net 20 Days"},
        {id:3, value:"NET_30_DAYS" , label :"Net 30 Days"},
      ]
      const handleItemChange = <K extends keyof Item>(index: number, field: K, value: Item[K]) => {
        const updatedItems = [...items];
      
        updatedItems[index][field] = value;
      
        if (field === 'quantity' || field === 'price') {
          updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
        }
      
        // Update state
        setItems(updatedItems);
        setInvoiceData({ ...invoiceData, items: updatedItems });
      };
      const handleDeleteItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        setInvoiceData({ ...invoiceData, items: updatedItems });
      };
    
      const handleChange = (section: 'billFrom' | 'billTo' | 'invoiceDetails', field: string) => (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | dayjs.Dayjs |string| null 
      ) => {
        if (section === 'invoiceDetails' && field === 'date'  ) {
            if (e && dayjs.isDayjs(e)) {
                setInvoiceData(prev => ({
                  ...prev,
                  invoiceDetails: { ...prev.invoiceDetails, date: e.format('DD MMM, YYYY') }
                }));
              }
        } 
        else if (section === 'invoiceDetails' && field === 'paymentTerms'  && typeof e === 'string') {
            const value = e ;
          setInvoiceData(prev => ({
            ...prev,
            invoiceDetails: { ...prev.invoiceDetails, paymentTerms: value }
          }));
        }
        else {
          const value = (e as React.ChangeEvent<HTMLInputElement>).target.value;
          setInvoiceData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
          }));
        }
      };
    
      const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const tax = subtotal * 0.1; // 10% tax
        return { subtotal, tax, total: subtotal + tax };
      };
   
      const { subtotal, total } = calculateTotal();
    
      const columns = [
        { title: 'Item', dataIndex: 'name', key: 'name' },
        { title: 'Qty.', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Total Amount', dataIndex: 'total', key: 'total', render: ( text:number) => text},
      ];

    
    const [createInvoice] = useMutation(CREATE_INVOICE);
    const handleSave = async () => {
        try {
          await createInvoice({
            variables: {
                input:{
                    createInvoiceAttributes: {
                        invoiceDate: invoiceData.invoiceDetails.date,
                        paymentTerms: invoiceData.invoiceDetails.paymentTerms,
                        projectDescription: invoiceData.invoiceDetails.projectDescription,
                        billingToAttributes: {
                          clientName: invoiceData.billTo.companyName,
                          clientEmail: invoiceData.billTo.email,
                          billingToAddressAttributes:{
                          streetAddress: invoiceData.billTo.address,
                          city: invoiceData.billTo.city,
                          country: invoiceData.billTo.country,
                          postalCode: invoiceData.billTo.postalCode,
                          }
                          
                        },
                        billingFromAttributes: {
                          companyName: invoiceData.billFrom.companyName,
                          companyEmail: invoiceData.billFrom.email,
                          billingFromAddressAttributes:{
                            streetAddress: invoiceData.billFrom.address,
                            city: invoiceData.billFrom.city,
                            country: invoiceData.billFrom.country,
                            postalCode: invoiceData.billFrom.postalCode,
                          }
                          
                        },
                        itemAttributes: invoiceData.items.map(item => ({
                          name: item.name,
                          quantity: item.quantity,
                          price: item.price,
                        
                        })),
                      },
                }
             
            },
          });

        customToast.success('Invoice saved successfully!');
        setInvoiceData(initialInvoiceData);
          
       
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err:any) {
            customToast.error('Invoice failed to save');
            console.log("error",  err.message)
        }
      };
      const handleSaveClick = () => {
        form
          .validateFields()
          .then(() => {
            handleSave();
          handleReset();



          })
          .catch((errorInfo) => {
            console.error('Validation Failed:', errorInfo);
          });
      };
    
    
      const handleReset = () => {
        form.resetFields(); 
      };
    
  return (
    <div className=" mt-2">
        <Row gutter={[16, 16]} justify='space-between' className="mx-2 my-3">
<Col xs={24} sm={24} md={12} lg={12} xl={12}>
<div className="haeding1">New Invoice</div>
<div className="text-med"style={{color:"#667085"}}>Create new invoice for your customers</div>
</Col>

<Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div className="w-100 d-flex justify-content-end gap-2">
          <Button
            type="default"
            disabled={false}
            className="btn-style"
              onClick={handleReset}
          >
           
            Reset
          </Button>
          <Button
            type="primary"
            disabled={false}
            className="btn-style"
              onClick={handleSaveClick}
          >
           
            Save
          </Button>
          </div>
</Col>

        </Row>
      <Row gutter={[16, 16]} justify="center" >
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
       <div  className=" form-container" >
       <Form form={form} layout="vertical" >
            {/* Bill From Section */}
            <span className="haeding1">Bill From</span>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Company Name"
                  name="fromName"
                  rules={[{ required: true, message: "Please enter company name" }]}
                >
                  <Input placeholder="Enter company name"  onChange={handleChange('billFrom', 'companyName')}/>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Company Email"
                  name="fromEmail"
                  rules={[{ required: true, message: "Please enter company email" }]}
                >
                  <Input placeholder="Enter company email"  onChange={handleChange('billFrom', 'email')}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Country"
                  name="fromCountry"
                  rules={[{ required: true, message: "Please select country" }]}
                >
                  <Select placeholder="Select country" onChange={handleChange('billFrom', 'country')}>
                    <Option value="USA">USA</Option>
                    <Option value="Canada">Canada</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item
                  label="City"
                  name="fromCity"
                  rules={[{ required: true, message: "Please enter city" }]}
                >
                  <Input placeholder="Enter city" onChange={handleChange('billFrom', 'city')}/>
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item
                  label="Postal Code"
                  name="fromPostalCode"
                  rules={[{ required: true, message: "Please enter postal code" }]}
                >
                  <Input placeholder="Enter postal code" onChange={handleChange('billFrom', 'postalCode')} />
                </Form.Item>
               
              </Col>
              
            </Row>
            <Row  gutter={[16,16]}>
              <Col xs={24} md={24}>
              <Form.Item
                  label="Street Address"
                  name="address"
                  rules={[{ required: true, message: "Please enter Address" }]}
                >
                  <Input placeholder="Enter Address"  onChange={handleChange('billFrom', 'address')} />
                </Form.Item></Col>
              </Row>

            {/* Bill To Section */}
            <span className="haeding1">Bill To</span>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Client's Name"
                  name="toName"
                  rules={[{ required: true, message: "Please enter client's name" }]}
                >
                  <Input placeholder="Enter client's name" onChange={handleChange('billTo', 'companyName')} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Client's Email"
                  name="toEmail"
                  rules={[{ required: true, message: "Please enter client's email" }]}
                >
                  <Input placeholder="Enter client's email" onChange={handleChange('billTo', 'email')}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Country"
                  name="toCountry"
                  rules={[{ required: true, message: "Please select country" }]}
                >
                  <Select placeholder="Select country" onChange={handleChange('billTo', 'country')}>
                    <Option value="USA">USA</Option>
                    <Option value="Canada">Canada</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item
                  label="City"
                  name="toCity"
                  rules={[{ required: true, message: "Please enter city" }]}
                >
                  <Input placeholder="Enter city"onChange={handleChange('billTo', 'city')} />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item
                  label="Postal Code"
                  name="toPostalCode"
                  rules={[{ required: true, message: "Please enter postal code" }]}
                >
                  <Input placeholder="Enter postal code"onChange={handleChange('billTo', 'postalCode')} />
                </Form.Item>
              </Col>
            </Row>
            <Row  gutter={[16,16]}>
              <Col xs={24} md={24}>
              <Form.Item
                  label="Street Address"
                  name="clientAddress"
                  rules={[{ required: true, message: "Please enter Address" }]}
                >
                  <Input placeholder="Enter Address"  onChange={handleChange('billTo', 'address')} />
                </Form.Item></Col>
              </Row>

            {/* Invoice Details */}
            {/* <h4>Invoice Details</h4> */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Invoice Date"
                  name="invoiceDate"
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <DatePicker placeholder="Select date" onChange={handleChange('invoiceDetails', 'date')}  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Payment Terms"
                  name="paymentTerms"
                  rules={[{ required: true, message: "Please select payment terms" }]}
                >
                  <Select placeholder="Select payment terms" 
                  options={paymenntTermsEnums}
                  onChange={handleChange('invoiceDetails', 'paymentTerms')}
                  >
                    {/* <Option value="NET_10_DAYS">Net 10 Days</Option>
                    <Option value="NET_20_DAYS">Net 20 Days</Option>
                    <Option value="NET_30_DAYS">Net 30 Days</Option> */}
                  </Select>
                 
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Project Description"
              name="projectDescription"
              rules={[{ required: true, message: "Please enter project description" }]}
            >
              <Input.TextArea placeholder="Enter project description" rows={2}  onChange={handleChange('invoiceDetails', 'projectDescription')}/>
            </Form.Item>

            {/* Items List */}
            <h4>Items List</h4>
            {items.map((item, index) => (
              <Row gutter={[16, 16]} key={index}>
                <Col xs={24} md={8}>
                  <Form.Item label="Item Name">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Item label="Qty.">
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", Number(e.target.value))
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Item label="Price">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", Number(e.target.value))
                        
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Item label="Total">
                    <Input value={item.quantity * item.price} readOnly />
                  </Form.Item>
                </Col>
                <Col xs={12} md={2}>
              <Form.Item label=" ">
                <div style={{cursor:"pointer"}}  onClick={() => handleDeleteItem(index)}>
                <img src={DeleteOutlined}/>
                </div>
                
              </Form.Item>
            </Col>
              </Row>
            ))}
            <Button onClick={handleAddItem} type="primary" block className="mb-4">
              + Add New Item
            </Button>
          </Form>
       </div>
        </Col>

        {/* Real-Time Data Preview Section */}
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <div className="invoice-preview  ">
            <h4>Preview</h4>
            <div className="form-container" style={{height:"auto" , border:"none"}}>
            <Row>
        <Col span={12}>
          <h4>New Invoice</h4>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={12}>
          <p>Invoice Date: {invoiceData.invoiceDetails.date}</p>
        </Col>
        <Col span={12}>
          <p>Payment Terms: {( paymenntTermsEnums.find(item  => item.value ===  invoiceData.invoiceDetails.paymentTerms))?.label }</p>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <p>
            <strong>Billed From:</strong> <br />
            {invoiceData.billFrom.companyName} <br />
            {invoiceData.billFrom.email} <br />
            {invoiceData.billFrom.address} <br />
            {invoiceData.billFrom.city}, {invoiceData.billFrom.postalCode} <br />
            {invoiceData.billFrom.country}
          </p>
        </Col>
        <Col span={12}>
          <p>
            <strong>Billed To:</strong> <br />
            {invoiceData.billTo.companyName} <br />
            {invoiceData.billTo.email} <br />
            {invoiceData.billTo.address} <br />
            {invoiceData.billTo.city}, {invoiceData.billTo.postalCode} <br />
            {invoiceData.billTo.country}
          </p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <p><strong>Project Description:</strong> {invoiceData.invoiceDetails.projectDescription}</p>
        </Col>
      </Row>
      <Table
        columns={columns} 
        dataSource={invoiceData.items.filter(
            (item) => !(invoiceData.items.length === 1 && !item.name && item.quantity === 0 && item.price === 0 && item.total === 0)
          )}        
        pagination={false} 
        rowKey={(record) => record.name} 
        tableLayout='auto'
      />
      <Row justify='end' className="mt-3">
        <Col span={5} >
          <p className="heading4 m-0">Subtotal</p>
          <p className="heading4 m-0">Tax</p>
          <p className="heading4 m-0">Total</p>
          {/* <p className="heading4">Tax: <span className="heading4 px-5">10%</span></p>
          <p className="heading4">Total: $: <span className="heading4 px-5">${total.toFixed(2)}</span></p> */}
         
        </Col>
        <Col span={8} >
           <p className="heading4 m-0">${subtotal.toFixed(2)}</p>
           <p className="heading4 m-0">10%</p>
           <p className="heading4 m-0">${total.toFixed(2)}</p>
        
         
        </Col>
      </Row>

            </div>
            
          </div>
        </Col>
      </Row>
    </div>
  );
};

