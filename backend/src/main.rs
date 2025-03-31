use actix_web::{App, HttpServer, Responder, get, web};

#[get("/health")]
async fn health() -> impl Responder {
    "Backend is running!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting backend server at http://localhost:8080");

    HttpServer::new(|| App::new().service(health))
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}
