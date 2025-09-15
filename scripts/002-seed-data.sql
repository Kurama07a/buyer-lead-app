-- Seed initial data for the buyer lead intake app

-- Insert demo admin user (password: admin123)
INSERT INTO "users" ("id", "email", "name", "password", "role", "createdAt", "updatedAt") 
VALUES (
    'admin-user-001',
    'admin@buyerleads.com',
    'Admin User',
    '$2b$12$NaNfRVRHN//L7FuXtd6sb.1Bs321En71gzdythxMY0FVZQ9aTAmr6', -- bcrypt hash for 'admin123'
    'ADMIN',
    NOW(),
    NOW()
);

-- Insert demo regular user (password: user123)
INSERT INTO "users" ("id", "email", "name", "password", "role", "createdAt", "updatedAt") 
VALUES (
    'user-001',
    'agent@buyerleads.com',
    'Real Estate Agent',
    '$2b$12$LDGls8vIL76SYSTcXglu8OThrJ2W4ofwjX.DIwrHbks/VfmA6hE9m', -- bcrypt hash for 'user123'
    'USER',
    NOW(),
    NOW()
);

-- Insert sample leads
INSERT INTO "leads" (
    "id", "firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode",
    "propertyType", "propertyAddress", "propertyCity", "propertyState", "propertyZipCode",
    "estimatedValue", "desiredTimeframe", "motivationForSelling", "currentMortgageBalance",
    "propertyCondition", "additionalNotes", "leadSource", "status", "priority",
    "createdAt", "updatedAt", "createdById"
) VALUES 
(
    'lead-001',
    'John',
    'Smith',
    'john.smith@email.com',
    '(555) 123-4567',
    '123 Main St',
    'Anytown',
    'CA',
    '90210',
    'SINGLE_FAMILY',
    '456 Oak Avenue',
    'Anytown',
    'CA',
    '90210',
    450000.00,
    '3-6 months',
    'Relocating for work',
    280000.00,
    'GOOD',
    'Motivated seller, needs quick sale',
    'Website Form',
    'NEW',
    'HIGH',
    NOW(),
    NOW(),
    'admin-user-001'
),
(
    'lead-002',
    'Sarah',
    'Johnson',
    'sarah.johnson@email.com',
    '(555) 987-6543',
    '789 Pine St',
    'Springfield',
    'TX',
    '75001',
    'CONDO',
    '321 Elm Street Unit 5B',
    'Springfield',
    'TX',
    '75001',
    275000.00,
    '6-12 months',
    'Downsizing',
    150000.00,
    'EXCELLENT',
    'Recently renovated, great condition',
    'Referral',
    'CONTACTED',
    'MEDIUM',
    NOW(),
    NOW(),
    'user-001'
),
(
    'lead-003',
    'Michael',
    'Davis',
    'michael.davis@email.com',
    '(555) 456-7890',
    '456 Maple Ave',
    'Riverside',
    'FL',
    '33101',
    'MULTI_FAMILY',
    '789 Cedar Lane',
    'Riverside',
    'FL',
    '33101',
    650000.00,
    'ASAP',
    'Financial hardship',
    420000.00,
    'FAIR',
    'Needs some repairs but good investment property',
    'Cold Call',
    'QUALIFIED',
    'URGENT',
    NOW(),
    NOW(),
    'admin-user-001'
);

-- Insert sample history records
INSERT INTO "lead_history" ("id", "leadId", "field", "oldValue", "newValue", "action", "timestamp", "userId")
VALUES 
(
    'history-001',
    'lead-001',
    'status',
    NULL,
    'NEW',
    'CREATED',
    NOW(),
    'admin-user-001'
),
(
    'history-002',
    'lead-002',
    'status',
    'NEW',
    'CONTACTED',
    'STATUS_CHANGED',
    NOW(),
    'user-001'
),
(
    'history-003',
    'lead-003',
    'status',
    'CONTACTED',
    'QUALIFIED',
    'STATUS_CHANGED',
    NOW(),
    'admin-user-001'
);
