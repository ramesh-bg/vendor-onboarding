# API Reference

```
BASE_URL=${BASE_URL:-http://localhost:3000}
```

## GET /api/vendors

List all registered vendors with optional filtering and pagination.

### Request

```bash
# Get all vendors
curl -X GET ${BASE_URL}/api/vendors

# Filter by company name
curl -X GET "${BASE_URL}/api/vendors?name=Acme"

# Filter by email
curl -X GET "${BASE_URL}/api/vendors?email=john@"

# Combine filters
curl -X GET "${BASE_URL}/api/vendors?name=Acme&email=john@acme.com"

# With pagination
curl -X GET "${BASE_URL}/api/vendors?page=2&per_page=20"
```

### Query Parameters

| Parameter  | Type    | Required | Description                                    |
| ---------- | ------- | -------- | ---------------------------------------------- |
| `name`     | string  | No       | Filter vendors by company name (partial match) |
| `email`    | string  | No       | Filter vendors by email (partial match)        |
| `page`     | integer | No       | Page number (default: 1, minimum: 1)           |
| `per_page` | integer | No       | Results per page (default: 10, maximum: 100)   |

### Response

**Status:** 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "name": "Acme Corp",
      "contact_person": "John Doe",
      "email": "john@acmecorp.com",
      "partner_type": "Supplier"
    },
    {
      "id": 2,
      "name": "Globex Inc",
      "contact_person": "Jane Smith",
      "email": "jane@globex.com",
      "partner_type": "Supplier"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "per_page": 10,
    "total_pages": 5
  }
}
```

### Error Response

**Status:** 500 Internal Server Error

```json
{
  "error": "Internal Server Error"
}
```

---

## POST /api/vendors

Create a new vendor. Email must be unique.

### Request

```bash
curl -X POST ${BASE_URL}/api/vendors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Solutions Ltd",
    "contact_person": "Alice Brown",
    "email": "alice@techsolutions.com",
    "partner_type": "Partner"
  }'
```

### Request Body

| Field            | Type   | Required | Description                    |
| ---------------- | ------ | -------- | ------------------------------ |
| `name`           | string | Yes      | Vendor company name            |
| `contact_person` | string | Yes      | Name of contact person         |
| `email`          | string | Yes      | Email address (must be unique) |
| `partner_type`   | string | Yes      | Either "Supplier" or "Partner" |

### Success Response

**Status:** 201 Created

```json
{
  "id": 5,
  "name": "Tech Solutions Ltd",
  "contact_person": "Alice Brown",
  "email": "alice@techsolutions.com",
  "partner_type": "Partner"
}
```

### Error Responses

**Status:** 400 Bad Request — Missing fields

```json
{
  "error": "All fields are required"
}
```

**Status:** 400 Bad Request — Invalid partner_type

```json
{
  "error": "partner_type must be either \"Supplier\" or \"Partner\""
}
```

**Status:** 409 Conflict — Email already exists

```json
{
  "error": "Email already exists"
}
```

**Status:** 500 Internal Server Error

```json
{
  "error": "Internal Server Error"
}
```

---

## DELETE /api/vendors/:id

Delete a vendor by ID.

### Request

```bash
curl -X DELETE ${BASE_URL}/api/vendors/1
```

### URL Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Vendor ID   |
