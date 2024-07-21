# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


ISO 8601形式
RFC 3339形式
Unix Time秒数
Unix Timeミリ秒数

```typescript
class DateConverter {
    // ISO 8601形式の日付文字列をUnix Time (秒数)に変換する
    static iso8601ToUnixTime(isoDate: string): number {
        return new Date(isoDate).getTime() / 1000;
    }

    // Unix Time (秒数)をISO 8601形式の日付文字列に変換する
    static unixTimeToIso8601(unixTime: number): string {
        return new Date(unixTime * 1000).toISOString();
    }

    // RFC 3339形式の日付文字列をUnix Time (秒数)に変換する
    static rfc3339ToUnixTime(rfcDate: string): number {
        return new Date(rfcDate).getTime() / 1000;
    }

    // Unix Time (秒数)をRFC 3339形式の日付文字列に変換する
    static unixTimeToRfc3339(unixTime: number): string {
        return new Date(unixTime * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
    }

    // 日付文字列のフォーマットを自動的に判別して、Unix Time (秒数)に変換する
    static dateStringToUnixTime(dateString: string): number | null {
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/;
        const rfcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?([+-]\d{2}:\d{2}|Z)$/;
        const unixTimeRegex = /^-?\d+(\.\d+)?$/;

        if (isoRegex.test(dateString)) {
            return this.iso8601ToUnixTime(dateString);
        } else if (rfcRegex.test(dateString)) {
            return this.rfc3339ToUnixTime(dateString);
        } else if (unixTimeRegex.test(dateString)) {
            return parseFloat(dateString); // Assume it's already in Unix Time format
        } else {
            return null; // Unable to determine the format
        }
    }

    // Unix Time (秒数)を日付文字列のフォーマットに自動的に変換する
    static unixTimeToDateString(unixTime: number): string | null {
        const date = new Date(unixTime * 1000);

        if (!isNaN(date.getTime())) {
            return date.toISOString();
        } else {
            return null; // Invalid Unix Time
        }
    }
}

// Example usage:

// Convert ISO 8601 date string to Unix Time
console.log(DateConverter.dateStringToUnixTime("2024-07-03T12:00:00Z")); // Output: 1717459200

// Convert Unix Time to RFC 3339 date string
console.log(DateConverter.unixTimeToRfc3339(1717459200)); // Output: 2024-07-03T12:00:00Z

```


```
1. 2024-07-04T14:30:00 (日付と時刻の基本形式)
2. 2024-07-04T14:30:00Z (UTC時刻)
3. 2024-07-04T14:30:00+03:00 (オフセット付き時刻)
4. 2024-07-04T14:30:00.123456Z (ミリ秒まで含むUTC時刻)
5. 2024-07-04T14:30:00.123456+03:00 (ミリ秒まで含むオフセット付き時刻)
6. 2024-07-04T14:30:00.123Z (秒とミリ秒まで含むUTC時刻)
7. 2024-07-04T14:30:00.123+03:00 (秒とミリ秒まで含むオフセット付き時刻)
8. 2024-W27-3T14:30:00 (週番号付き日付と時刻)
9. 2024-186T14:30:00 (年と年通算日付付き日付と時刻)
10. 2024-07-04T14:30:00+03:00[America/New_York] (タイムゾーン識別子を含むオフセット付き時刻)
```

```
RFC 3339 - Date and Time on the Internet: Timestamps

インターネット上の日付と時刻の形式について定義しています。ISO 8601の拡張形式を基にしています。
RFC 5322 - Internet Message Format

インターネットメッセージのフォーマットに関するRFCで、日時のフォーマットについても規定しています。
RFC 2822 - Internet Message Format

こちらもインターネットメッセージのフォーマットに関するRFCで、日時のフォーマットについて詳細に述べられています。
RFC 822 - Standard for the Format of ARPA Internet Text Messages

このRFCは、電子メールのフォーマットに関する標準を定めており、日時のフォーマットも含まれています。
RFC 7231 - Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content

HTTPプロトコルに関するRFCで、日時のフォーマットについても言及されています。
RFC 7232 - Hypertext Transfer Protocol (HTTP/1.1): Conditional Requests

HTTPの条件付きリクエストに関するRFCで、日時がリソースのバージョン管理にどのように使用されるかを定義しています。
RFC 7233 - Hypertext Transfer Protocol (HTTP/1.1): Range Requests

HTTPの範囲リクエストに関するRFCで、リソースの部分取得において日時がどのように使用されるかを述べています。
RFC 6265 - HTTP State Management Mechanism

HTTPのクッキーに関するRFCで、有効期限や最終アクセス時刻などの日時の扱いについて規定しています。
```
formatISO
formatISO9075 SQL
formatRFC3339
formatRFC7231
