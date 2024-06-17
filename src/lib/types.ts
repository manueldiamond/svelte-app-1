
export interface UserLink{
    title:string,
    url:string,
    icon:string
  }
export interface UserData{
    username:string,
    photoURL?:string|null,
    published?:boolean;
    bio:string,
    links: UserLink[]
}


  