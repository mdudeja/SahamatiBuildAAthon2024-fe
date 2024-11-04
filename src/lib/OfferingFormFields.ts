const LoanOfferingFormFields: OfferingFormField[] = [
  {
    id: "title",
    fieldType: "text",
    label: "Title",
  },
  {
    id: "loanType",
    fieldType: "select",
    label: "Loan Type",
    options: [
      {
        value: "home",
        label: "Home Loan",
      },
      {
        value: "personal",
        label: "Personal Loan",
      },
      {
        value: "auto",
        label: "Auto Loan",
      },
      {
        value: "education",
        label: "Education Loan",
      },
      {
        value: "gold",
        label: "Gold Loan",
      },
      {
        value: "business",
        label: "Business Loan",
      },
    ],
  },
  {
    id: "loanAmount",
    fieldType: "number",
    label: "Loan Amount (INR)",
  },
  {
    id: "interestRate",
    fieldType: "number",
    label: "Interest Rate (%)",
  },
  {
    id: "loanTenure",
    fieldType: "number",
    label: "Loan Tenure (Years)",
  },
  {
    id: "emi",
    fieldType: "number",
    label: "EMI (INR)",
  },
  {
    id: "processingFee",
    fieldType: "number",
    label: "Processing Fee (%)",
  },
  {
    id: "foreclosureCharges",
    fieldType: "number",
    label: "Foreclosure Charges (%)",
  },
  {
    id: "partPaymentCharges",
    fieldType: "number",
    label: "Part Payment Charges (%)",
  },
]

const SIPOfferingFormFields: OfferingFormField[] = [
  {
    id: "title",
    fieldType: "text",
    label: "Title",
  },
  {
    id: "sipAmount",
    fieldType: "number",
    label: "SIP Amount (INR)",
  },
  {
    id: "sipTenure",
    fieldType: "number",
    label: "SIP Tenure (Months)",
  },
  {
    id: "sipReturnRate",
    fieldType: "number",
    label: "Expected Return Rate (%)",
  },
  {
    id: "sipFrequency",
    fieldType: "select",
    label: "SIP Frequency",
    options: [
      {
        value: "monthly",
        label: "Monthly",
      },
      {
        value: "quarterly",
        label: "Quarterly",
      },
      {
        value: "halfYearly",
        label: "Half Yearly",
      },
      {
        value: "yearly",
        label: "Yearly",
      },
    ],
  },
]

const MutualFundOfferingFormFields: OfferingFormField[] = [
  {
    id: "title",
    fieldType: "text",
    label: "Title",
  },
  {
    id: "fundAmount",
    fieldType: "number",
    label: "Fund Amount (INR)",
  },
  {
    id: "fundTenure",
    fieldType: "number",
    label: "Fund Tenure (Years)",
  },
  {
    id: "fundReturnRate",
    fieldType: "number",
    label: "Expected Return Rate (%)",
  },
  {
    id: "fundType",
    fieldType: "select",
    label: "Fund Type",
    options: [
      {
        value: "equity",
        label: "Equity",
      },
      {
        value: "debt",
        label: "Debt",
      },
      {
        value: "hybrid",
        label: "Hybrid",
      },
    ],
  },
]

export type OfferingFormField = {
  id: string
  fieldType: string
  label: string
  options?: { value: string; label: string }[]
}

export const OfferingFormFields = {
  loan: LoanOfferingFormFields,
  sip: SIPOfferingFormFields,
  fund: MutualFundOfferingFormFields,
}
