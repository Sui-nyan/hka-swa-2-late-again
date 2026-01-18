```
// Sets up docker container
npm run pg-docker

// Initializes db
npx prisma migrate dev --name init

// Query stations, run import_stations.py
// Query plan, run import_plans.py
```
