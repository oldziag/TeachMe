export interface LoginData {
    email: string,
    username?: string,
    phone?: string,
    password: string,
    isPasswordShown: boolean,
}

export function checkData(obj: LoginData) {

    if (Object.values(obj).some(el => el === "")) {
        throw new Error("Please fill in all fields")
    }

}