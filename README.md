#RUNDOWN
- **Frontend:** React + Vite + TypeScript + Recharts
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Poseidon)
- **ORM:** Prisma
- **Charts:** Recharts

## Features
- **Overview:** High-level project metrics
- **Histogram:** Complexity distribution (fixed buckets)
- **Class Sizes:** LOC per class + raw table
- **Trend:** Complexity over time
- **Benchmarks:** Compare repositories


----------------------------------------------------------------------------------



Terminal 1
cd code-tuner-viz-frontend


npm install

npm run dev

Terminal 2
cd code-tuner-viz-backend

npm install

npx prisma generate

npm run dev

CMD to create an SSH tunnel to the backend that is hosted on poseidon.
ssh -N -L 15432:127.0.0.1:5432 hc25-33@pacifically-bugaboo.poseidon.salford.ac.uk 
It will ask for a password make sure that you enter this correctly it will not show as your typing so make sure you know what your pressing the password is: jai&nahFe0xi

Make sure that you have NodeJS installed on your machine and also if you encounter issues when trying to run npm inside of visual studio code then youll have to give your machine access.
https://nodejs.org/dist/v25.3.0/node-v25.3.0-x64.msi

Powershell: 
Set-ExecutionPolicy RemoteSigned
Then restart VS Code
