interface CookieOptions {
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

type CookieValue = string | number | boolean | object;

interface CookieData {
  [key: string]: CookieValue;
}

/**
 * 设置 cookie
 * @param cookies - 要写入 document.cookie 中的对象
 * @param options - cookie 配置选项
 * @param callback - cookie 设置成功的回调函数
 */
function setCookie(
  cookies: CookieData,
  options: CookieOptions = {},
  callback?: () => void
): void {
  const defaultOptions: CookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
    path: "/",
  };

  const finalOptions = { ...defaultOptions, ...options };
  const expires =
    finalOptions.expires instanceof Date
      ? finalOptions.expires.toUTCString()
      : new Date(
          Date.now() + ((finalOptions.expires as number) || 0)
        ).toUTCString();

  for (const [key, value] of Object.entries(cookies)) {
    let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(
      String(value)
    )}`;

    cookieString += `;expires=${expires}`;
    if (finalOptions.path) cookieString += `;path=${finalOptions.path}`;
    if (finalOptions.domain) cookieString += `;domain=${finalOptions.domain}`;
    if (finalOptions.secure) cookieString += ";secure";
    if (finalOptions.sameSite)
      cookieString += `;samesite=${finalOptions.sameSite}`;

    document.cookie = cookieString;
  }

  callback?.(); // 使用可选链操作符
}

/**
 * 按名称获取 cookie 的值
 * @param cookieName - cookie 名称
 * @returns cookie 的值或 null
 */
function getCookie(cookieName: string): string | null {
  const cookies: { [key: string]: string } = {};
  const cookieArr = document.cookie.split(";");

  for (const cookie of cookieArr) {
    const [key, value] = cookie.split("=").map((item) => item.trim());
    if (key && value) {
      cookies[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  }

  return cookies[cookieName] || null;
}

/**
 * 删除指定的 cookie
 * @param names - 要删除的 cookie 名称数组，如果不传则删除所有
 * @param options - cookie 配置选项
 * @param callback - 删除成功的回调函数
 */
function deleteCookie(
  names?: string[],
  options: Omit<CookieOptions, "expires"> = {},
  callback?: () => void
): void {
  const cookieNames = names || document.cookie.match(/[^ =;]+(?=\=)/g) || [];
  const domains = [
    options.domain || document.domain,
    "." + document.domain,
    "." + document.domain.split(".").slice(-2).join("."),
  ];

  for (const name of cookieNames) {
    for (const domain of domains) {
      setCookie(
        { [name]: "" },
        {
          ...options,
          expires: new Date(0),
          domain,
          path: "/",
        }
      );
    }
  }

  callback?.();
}

export {
  setCookie,
  getCookie,
  deleteCookie,
  type CookieOptions,
  type CookieData,
};
