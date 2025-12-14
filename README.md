
1. setup local database
   
versi postgresql = PostgreSQL 17.6 

CREATE DATABASE stockopname

untuk database bisa juga restore file dump-stockopname-202512141432

2. setup local backend
   
versi node = v18.16.1

npm install

file .env isinya:
DATABASE_URL=postgres://postgres:password@localhost:5432/stockopname
PORT=3000

migration:
npx drizzle-kit generate:pg
npx drizzle-kit push:pg

3. setup local frontend
   
versi node = v18.16.1

npm install


=============================================================================================================================
point yang disampaikan:
terdapat halaman login, dengan role "admin" dan "staff", terlampir screenshoot di file doc screenshoot-application
untuk "admin" bisa akses Menu:
1. Dashboard
2. Stock
3. Gudang
4. Produk
5. Users
untuk "staff" hanya bisa akses Menu:
1. Dashboard
2. Stock


=============================================================================================================================
cara penggunaan, 
1. langkah pertama setup di lokal seperti langkah di atas
2. langkah kedua bikin users lewat postman atau hasil dari restore DB krn klo restore DB menggunakan data yg existing
3. langkah ketiga bikin data product dan data gudang
4. baru nanti bisa memakai menu Stock dan menu Dashboard





