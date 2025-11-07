export const changePhoneNo = (phone: string) => {

    if (phone.startsWith('09')) {
        return '+959' + phone.slice(2);
    } else if (phone.startsWith('+959')) {
        return phone;
    } else {
        // throw new Error('Invalid phone number format');
        return phone;
    }

}