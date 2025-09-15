export interface CSVLead {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  propertyType: string
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZipCode: string
  estimatedValue?: number
  desiredTimeframe?: string
  motivationForSelling?: string
  currentMortgageBalance?: number
  propertyCondition?: string
  additionalNotes?: string
  leadSource?: string
  status?: string
  priority?: string
}

export function parseCSV(csvText: string): CSVLead[] {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  const leads: CSVLead[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length !== headers.length) {
      console.warn(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`)
      continue
    }

    const lead: any = {}
    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      if (value) {
        // Map CSV headers to our field names
        const fieldName = mapCSVHeaderToField(header)
        if (fieldName) {
          if (fieldName === "estimatedValue" || fieldName === "currentMortgageBalance") {
            lead[fieldName] = Number.parseFloat(value) || undefined
          } else {
            lead[fieldName] = value
          }
        }
      }
    })

    // Validate required fields
    if (
      lead.firstName &&
      lead.lastName &&
      lead.email &&
      lead.propertyType &&
      lead.propertyAddress &&
      lead.propertyCity &&
      lead.propertyState &&
      lead.propertyZipCode
    ) {
      leads.push(lead)
    } else {
      console.warn(`Row ${i + 1} missing required fields, skipping`)
    }
  }

  return leads
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

function mapCSVHeaderToField(header: string): string | null {
  const mapping: Record<string, string> = {
    "first name": "firstName",
    firstname: "firstName",
    first_name: "firstName",
    "last name": "lastName",
    lastname: "lastName",
    last_name: "lastName",
    email: "email",
    "email address": "email",
    phone: "phone",
    "phone number": "phone",
    address: "address",
    city: "city",
    state: "state",
    zip: "zipCode",
    "zip code": "zipCode",
    zipcode: "zipCode",
    "property type": "propertyType",
    propertytype: "propertyType",
    property_type: "propertyType",
    "property address": "propertyAddress",
    propertyaddress: "propertyAddress",
    property_address: "propertyAddress",
    "property city": "propertyCity",
    propertycity: "propertyCity",
    property_city: "propertyCity",
    "property state": "propertyState",
    propertystate: "propertyState",
    property_state: "propertyState",
    "property zip": "propertyZipCode",
    "property zip code": "propertyZipCode",
    "property zipcode": "propertyZipCode",
    propertyzipcode: "propertyZipCode",
    property_zip_code: "propertyZipCode",
    "estimated value": "estimatedValue",
    estimatedvalue: "estimatedValue",
    estimated_value: "estimatedValue",
    value: "estimatedValue",
    "desired timeframe": "desiredTimeframe",
    timeframe: "desiredTimeframe",
    desired_timeframe: "desiredTimeframe",
    motivation: "motivationForSelling",
    "motivation for selling": "motivationForSelling",
    motivationforselling: "motivationForSelling",
    motivation_for_selling: "motivationForSelling",
    "mortgage balance": "currentMortgageBalance",
    "current mortgage balance": "currentMortgageBalance",
    mortgagebalance: "currentMortgageBalance",
    current_mortgage_balance: "currentMortgageBalance",
    "property condition": "propertyCondition",
    condition: "propertyCondition",
    propertycondition: "propertyCondition",
    property_condition: "propertyCondition",
    notes: "additionalNotes",
    "additional notes": "additionalNotes",
    additionalnotes: "additionalNotes",
    additional_notes: "additionalNotes",
    "lead source": "leadSource",
    source: "leadSource",
    leadsource: "leadSource",
    lead_source: "leadSource",
    status: "status",
    priority: "priority",
  }

  const normalizedHeader = header.toLowerCase().trim()
  return mapping[normalizedHeader] || null
}

export function generateCSV(leads: any[]): string {
  if (leads.length === 0) {
    return ""
  }

  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Address",
    "City",
    "State",
    "ZIP Code",
    "Property Type",
    "Property Address",
    "Property City",
    "Property State",
    "Property ZIP Code",
    "Estimated Value",
    "Desired Timeframe",
    "Motivation for Selling",
    "Current Mortgage Balance",
    "Property Condition",
    "Additional Notes",
    "Lead Source",
    "Status",
    "Priority",
    "Created Date",
    "Created By",
  ]

  const csvRows = [headers.join(",")]

  leads.forEach((lead) => {
    const row = [
      escapeCSVField(lead.firstName || ""),
      escapeCSVField(lead.lastName || ""),
      escapeCSVField(lead.email || ""),
      escapeCSVField(lead.phone || ""),
      escapeCSVField(lead.address || ""),
      escapeCSVField(lead.city || ""),
      escapeCSVField(lead.state || ""),
      escapeCSVField(lead.zipCode || ""),
      escapeCSVField(lead.propertyType?.replace("_", " ") || ""),
      escapeCSVField(lead.propertyAddress || ""),
      escapeCSVField(lead.propertyCity || ""),
      escapeCSVField(lead.propertyState || ""),
      escapeCSVField(lead.propertyZipCode || ""),
      lead.estimatedValue || "",
      escapeCSVField(lead.desiredTimeframe || ""),
      escapeCSVField(lead.motivationForSelling || ""),
      lead.currentMortgageBalance || "",
      escapeCSVField(lead.propertyCondition?.replace("_", " ") || ""),
      escapeCSVField(lead.additionalNotes || ""),
      escapeCSVField(lead.leadSource || ""),
      escapeCSVField(lead.status?.replace("_", " ") || ""),
      escapeCSVField(lead.priority || ""),
      new Date(lead.createdAt).toLocaleDateString(),
      escapeCSVField(lead.createdBy?.name || lead.createdBy?.email || ""),
    ]
    csvRows.push(row.join(","))
  })

  return csvRows.join("\n")
}

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}
