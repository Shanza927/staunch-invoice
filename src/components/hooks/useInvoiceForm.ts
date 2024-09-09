import { useMutation, gql } from '@apollo/client';
import { customToast } from "../CustomToast";
import dayjs from 'dayjs';
import { useState } from "react";
import { Form } from 'antd';




export const useInvoiceForm = () => {

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
      const [createInvoice] = useMutation(CREATE_INVOICE);

  
      
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
      

    return {
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


      };
}