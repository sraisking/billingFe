export const isTokenExpired = (token) => {
    if (!token) {
      return true;
    }
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  };