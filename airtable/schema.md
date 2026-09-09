# Airtable layer

Create a base named **BenefitPath Leads** with two tables.

## Table: Leads

| Field | Type | Notes |
| --- | --- | --- |
| Lead ID | Single line text | Primary business key from the funnel (`leadId`) |
| Email | Email | |
| Phone | Phone number | 10-digit US |
| First Name | Single line text | |
| Last Name | Single line text | |
| ZIP | Single line text | 5-digit, used for CA restriction + Meta matching |
| Gender | Single select | Male, Female, Non - Binary, Prefer not to respond |
| Age Range | Single select | Under 40, 40-49, 50-54, 55-63, 64 or older |
| Lead Grade | Single select | A, B, C |
| Qualified | Single select | Yes, No |
| Status | Single select | New, Restricted, Disqualified, Contacted, Dead |
| Event ID | Single line text | Latest Meta `event_id` (dedup key) |
| Event Name | Single select | Lead, CompleteRegistration |
| Match Quality | Number | 0–10 estimate from identifiers sent to CAPI |
| Estimated Monthly | Currency | USD |
| Answers JSON | Long text | Full qualification answers |
| UTM Source | Single line text | |
| UTM Campaign | Single line text | |
| fbp | Single line text | |
| fbc | Single line text | |
| Consent At | Date | TCPA timestamp |
| Last Event At | Date | |
| Created | Created time | Airtable native |

Use **Lead ID** as the upsert key. n8n searches `{Lead ID} = '...'` then updates or creates. That prevents duplicate partner records when Pixel + CAPI both cause a retry, or when a user submits email then contact.

## Table: Failures

| Field | Type |
| --- | --- |
| Error | Long text |
| Payload | Long text |
| Failed At | Date |
| Status | Single select: Open, Retrying, Resolved |

The n8n error workflow writes here. The React `/ops` dashboard is the complementary view for **our** outbox (Meta + n8n delivery), so failures are visible even if Airtable is down.

## Sample record

See `sample-records.csv`.
