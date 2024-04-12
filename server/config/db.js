import mysql from "mysql2/promise"

const connexion = () =>{
    try{
        return mysql.createPool({
            host :'localhost',
            user : 'root',
            password : '',
            database : 'blog',
            waitForConnections : true,
            connectionLimit: 100,
            queueLimit : 0
        });
    }catch(err){
        console.log(err)
    }
    
}
export default connexion;