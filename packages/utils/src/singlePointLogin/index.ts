export class SingleSignOnService {
  url: string;
  // 构造函数，接收一个SingleSignOnConfig类型的参数
  constructor(url: string) {
    this.url = url
  }

  /**
   * Initiates the SSO login process
   */
  // 登录方法
  public login(): void {
    // 将参数拼接到授权端点，并跳转到该页面
    window.location.href = this.url;
  }

  /**
   * Handles the SSO callback
   * @returns The authorization code or token from the URL
   */
  // Handle callback function
  public handleCallback(): { code: string | null, gateway_uri: string | null } {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    // Return authorization code
    return {
      code: urlParams.get('code'),
      gateway_uri: urlParams.get('gateway_uri'),
    }
  }

  /**
   * Logs the user out
   * @param logoutUrl The URL to redirect to after logout
   */
  // 退出登录
  public logout(logoutUrl?: string): void {
    // Clear any local authentication data
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_state');

    if (logoutUrl) {
      window.location.href = logoutUrl;
    }
  }
}

// // Usage example:
// const sso = new SingleSignOnService('http://your-sso.com/login');

// // Start login process
// sso.login();

// // Handle 
// const result = sso.handleCallback();
// console.log(result.code)

// // Logout
// sso.logout('http://your-app.com/logout');
