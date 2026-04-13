export interface User {
    id: UUID,
    role: Role,
    username: string,
    lastname: string,
    email: string,
    phoneNumber: string,
    clazz: string,
}

export interface LoginData {
    email: string,
	password: string,
}

export interface UpdatePassword {
    activeCode: string,
    password: string
}

export interface UpdatePasswordAnonymous {
    email: string,
    activeCode: string,
    password: string
}

export interface Registiterung {
    username: string,
    lastname: string,
    password: string,
    email: string,
    phoneNumber: string,
    clazz: string
}

export interface CreateMessage {
    rideId: UUID, 
    content: string
}

export interface Message {
    userId: UUID, 
    username: string,
    content: string,
    timestamp: Date,
}
export interface CreateRide {
    postalCode: string,
    street: string, 
    houseNumber: string,
    city: string,
    startDate: Date,
    startTime: Date,
    endTime: Date,
    price: number,
    seats: number, 
}

export interface Ride {
    id: UUID,
    driverName: string,
    driverId: UUID, 
    postalCode: string,
    street: string, 
    houseNumber: string,
    city: string,
    startDate: string,
    createDate: Date,
    startTime: Date,
    endTime: Date,
    price: number,
    seats: number, 
    belgeSeats: number,
    status: Status, 
}

export interface Adress {
    postalCode: string,
    street: string, 
    houseNumber: string,
    city: string
}

export interface Cordinates {
    lng: number,
    lat: number
}

export interface CreateReported {
    userId: UUID,
    subject: string,
    description: string
}

export interface Month {
    mainColumn: number,
    secondaryColumn: number,
}

export interface ColorSetStatus {
    background: string,
    text: string,
    border: string,
}

export interface UserForAdmin {
    id: UUID,
    username: string,
    lastname: string,
    email: string,
    reportStatus: boolean,
    reportCount: number,
}

export interface Report {
    id: UUID,
    subject: string,
    description: string,
    timestamp: Date,
    reportedUserId: UUID,
    reportedUserName: string,
    reporterUserId: UUID,
    reporterUserName: string,
}

export type UUID = string;

export enum Status {
    PENDING = 'PENDING',
    CLOSED = 'CLOSED',
    CANCEL = 'CANCEL',
    ACTIVE = 'ACTIVE',
}

export enum Role {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN',
}