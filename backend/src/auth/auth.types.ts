export type IUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type LoginProps = {
    email: string;
    password: string;
}

export type RegisterProps = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export type ResetPasswordProps = {
    email: string;
}

export type ChangePasswordProps = {
    newPassword: string;
}

export type ChangeOldPasswordProps = {
    oldPassword: string;
    newPassword: string;
}