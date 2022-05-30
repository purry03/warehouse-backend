interface ProcessEnv{
    SECRET:string;
    DIR:string;
}

interface JwtData{
    username : string;
    userType: string;
    createdAt: Date;
}

interface Err{
    err : string;
}

interface ReqRegister{
    username: string;
    password: string;
    type: string;
}

interface ReqLogin{
      username: string;
    password: string;
}

interface ReqAddListing{
    title: string;
    description: string;
    price: number;
    inventory: number;
}

interface ID{
    id: string;
}

interface Query{
    query:string;
}

interface Username{
    username:string;
}

interface PrebookingNumber{
    prebookingNumber: string;
}

interface Response{
    status: number;
    body?:any;
}

interface User{
    username:string;
    type:string;
}

interface DbUser{
    user_id:string;
    username:string;
    password:string;
    type:string;
}

interface DbListing{
    listing_id:string;
    user_id:number;
    img:string;
    title:string;
    description:string;
    inventory:number;
    price:number;
}

interface DbPrebooking{
    prebooking_id:string;
    prebooking_number:string;
    listing_id:number;
    user_id:number;
    quantity:number;
    created_at:Date;
}

interface Prebooking{
    username:string;
    quantity:number;
    productTitle:string;
    productPrice:number;
  }
