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
    body: string
}