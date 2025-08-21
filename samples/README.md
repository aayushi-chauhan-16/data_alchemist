```markdown
# Sample Data Files

This folder contains sample data files for testing the Data Alchemist application:

## Valid Data Files
- `clients.csv` - Sample client data with proper formatting
- `workers.csv` - Sample worker data with skills and availability
- `tasks.csv` - Sample task data with requirements and phases

## Invalid Data Files (for testing validation)
- `invalid_clients.csv` - Contains duplicate IDs, invalid JSON, empty fields
- `malformed_workers.csv` - Contains type errors, negative values, malformed data

## File Structure Notes

### Clients
- ClientID: Unique identifier
- ClientName: Display name
- PriorityLevel: 1-5 priority rating
- RequestedTaskIDs: JSON array of task IDs
- GroupTag: Client category/group
- AttributesJSON: Additional metadata as JSON object

### Workers  
- WorkerID: Unique identifier
- WorkerName: Display name
- Skills: JSON array of skills
- AvailableSlots: JSON array of phase numbers when available
- MaxLoadPerPhase: Maximum concurrent tasks per phase
- WorkerGroup: Team/department
- QualificationLevel: Skill level 1-5

### Tasks
- TaskID: Unique identifier  
- TaskName: Display name
- Category: Task category/type
- Duration: Estimated hours
- RequiredSkills: JSON array of required skills
- PreferredPhases: JSON array of preferred phase numbers
- MaxConcurrent: Maximum concurrent instances allowed

## Usage
Upload these files through the Data Alchemist interface to test:
1. Data parsing and validation
2. Error detection and reporting
3. AI-powered data cleaning suggestions
4. Business rule validation
```