const GetRandomUniqueNumber = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    const uniqueNumber = parseInt(`${timestamp}${randomNum}`, 10);
    return uniqueNumber;
}
export const CommonHelper = {
    GetRandomUniqueNumber
}