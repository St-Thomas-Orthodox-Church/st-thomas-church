export interface LiturgicalDay{
    id: string
    title: string;
    start: string;
    end?:string;
    fast:boolean;
    epistle: string[];
    gospel : string[];
    link : string;
    commemorations: string;
    class: string;
}