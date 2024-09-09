import { gql } from '@apollo/client';

export const SAVE_INVOICE_MUTATION = gql`
  mutation SaveInvoice($input: CreateInvoiceInput!) {
    saveInvoice(input: $input) {
      id
      # Add other fields you expect in the response
    }
  }
`;
