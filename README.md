# EcoCycle  
### An e-commerce platform dedicated to selling recycled products.

- [Prorotype] [https://ecocycle-frontend.onrender.com/](https://ecocycle-frontend.onrender.com/)

## Team Members

- 6510742163 นางสาวศุภิสรา สีถาวร
- 6510742452 นายพีรภาส งอกผล

## Previews

<img src="https://github.com/Jamesselmon/EcocycleDeploy/tree/main/assets/product.PNG">

<img src="https://github.com/Jamesselmon/EcocycleDeploy/tree/main/assets/productdetail.PNG">

<img src="https://github.com/Jamesselmon/EcocycleDeploy/tree/main/assets/order.PNG">

<img src="https://github.com/Jamesselmon/EcocycleDeploy/tree/main/assets/thankyou.PNG">

<img src="https://github.com/Jamesselmon/EcocycleDeploy/tree/main/assets/admin.PNG">

## Features

- **Browse Recycled Products:** Explore eco-friendly items.
- **Product Listings:** Detailed information about each product.
- **User Authentication:** Secure user registration and login.
- **Shopping Cart:** Add and manage items in your cart.
- **Order History:** View past purchases.
- **Admin Dashboard:** Admin user can view overall system information.

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend:** [Django](https://www.djangoproject.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) 
- **Deployment:** [Render](https://render.com/) 

## Deployment

EcoCycle is deployed on Render using three separate services:

1.  **Frontend (Next.js):** [https://ecocycle-frontend.onrender.com](https://ecocycle-frontend.onrender.com)
2.  **Backend (Django):** [Link to your Render Backend Service](https://ecocycle-backend-xoli.onrender.com)
3.  **Database (PostgreSQL):** Hosted on Render.

## Setup Instructions (for local development)

To run EcoCycle locally, follow these steps:

### Backend (Django)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On macOS/Linux
    # venv\Scripts\activate   # On Windows
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the backend directory and configure your environment variables :
    ```
    SECRET_KEY=your_django_secret_key  
    DEBUG=1                             
    DB_NAME=your_local_db_name        
    DB_USER=your_local_db_user         
    DB_PASSWORD=your_local_db_password 
    DB_HOST=localhost                   
    DB_PORT=5432                        
    ALLOWED_HOSTS=http://localhost:3000
    DATABASE_URL=postgresql://your_local_db_user:your_local_db_password@localhost:5432/your_local_db_name
    CORS_ALLOWED_ORIGINS=http://localhost:3000
    ```
5.  Apply migrations:
    ```bash
    python manage.py migrate
    ```
6.  Create a superuser:
    ```bash
    python manage.py createsuperuser
    ```
7.  Run the Django development server:
    ```bash
    python manage.py runserver
    ```
    The backend will typically run on `http://localhost:8000`.

### Frontend (Next.js)

1.  Navigate to the frontend directory:
    ```bash
    cd EcoCycle
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env.local` file in the frontend directory and configure your environment variables:
    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/
    PORT=3000
    ```
4.  Run the Next.js development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend will typically run on `http://localhost:3000`.

### Database (PostgreSQL)

You can run PostgreSQL using Docker for a consistent environment:

1.  Create a `docker-compose.yml` file:
    ```yaml
    version: '3.8'
    services:
      db:
        image: postgres:latest
        restart: always
        environment:
          POSTGRES_USER: your_db_user
          POSTGRES_PASSWORD: your_db_password
          POSTGRES_DB: your_db_name
        ports:
          - '5432:5432'
        volumes:
          - db_data:/var/lib/postgresql/data/

    volumes:
      db_data:
    ```
2.  Start the PostgreSQL service:
    ```bash
    docker-compose up -d
    ```