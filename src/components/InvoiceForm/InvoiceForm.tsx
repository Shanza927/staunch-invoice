import { Form, Input, Button, DatePicker, Select, Row, Col, Table } from "antd";
import './Invoice.css';
import  DeleteOutlined  from  '../../assets/trashIcon.svg';
import { useInvoiceForm } from "../hooks/useInvoiceForm";
const { Option } = Select;
export const InvoiceForm = () => {
    const {
        handleAddItem ,
        paymenntTermsEnums,
        handleItemChange,
        handleSaveClick,
        handleReset,
        handleDeleteItem,
        handleChange,
        subtotal,
        total,
        columns,
        invoiceData,
        form,
        items
} = useInvoiceForm();
    
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
                <Col xs={24} md={8} lg={10}>
                  <Form.Item label="Item Name">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={4} lg={4}>
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
                <Col xs={12} md={4} lg={4}>
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
                <Col xs={12} md={4} lg={4}>
                  <Form.Item label="Total">
                    <Input value={item.quantity * item.price} readOnly />
                  </Form.Item>
                </Col>
                <Col xs={12} md={2}  lg={2}>
              <Form.Item label=" ">
                <div style={{cursor:"pointer"}}  onClick={() => handleDeleteItem(index)}>
                <img src={DeleteOutlined}/>
                </div>
                
              </Form.Item>
            </Col>
              </Row>
            ))}
            <Button onClick={handleAddItem} type="primary" block className="mb-4 btn-style">
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
          <>
          <div className="heading4">Billed To:</div>
            <div>{invoiceData.billFrom.companyName}</div>
            <div> {invoiceData.billFrom.email}</div>
            <div> {invoiceData.billFrom.address}</div>
            <div>{invoiceData.billFrom.city} {invoiceData.billFrom.city && ','} {invoiceData.billFrom.postalCode}</div>
            <div>{invoiceData.billFrom.country}</div>

          </>
        </Col>
        <Col span={12}>
          <div className="mb-5">
            <div className="heading4">Billed To:</div>
            <div>{invoiceData.billTo.companyName}</div>
            <div> {invoiceData.billTo.email}</div>
            <div> {invoiceData.billTo.address}</div>
            <div>{invoiceData.billTo.city} {invoiceData.billTo.city && ','} {invoiceData.billTo.postalCode}</div>
            <div>{invoiceData.billTo.country}</div>
          
           
            
          </div>
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

