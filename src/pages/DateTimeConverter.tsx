import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import { ChangeEvent, useState } from "react";
import {objectIdToUnixTime, timeZoneList, unixTimeToObjectId} from '../services/DateTimeService'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function DateTimeConverter() {
  const [dateTimeValue, setDateTimeValue] = useState<String>("");
  const [timeZone, setTimeZone] = useState<String>("Asia/Tokyo")
  const [dateTimeError, setDateTimeError] = useState(false);
  const [dateTime, setDateTime] = useState<DateTime>(DateTime.now());

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setDateTimeValue(e.target.value);
  }

  const handleConvert = () => {
    // TODO: 本当は、チェックがいる
    let dateTime = detectDateTimeFormat(dateTimeValue.toString());
    if (dateTime == null) {
      setDateTimeError(true);
    } else {
      setDateTimeError(false);
      setDateTime(dateTime);
    }
  }

  function isNumber(value: any): boolean {
    return /^\d+$/.test(value);
  }
  function isMongoObjectId(str: string): boolean {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(str);
  }

  function detectDateTimeFormat(input: string): DateTime | null {
    if (isNumber(input) && input.length <= 10) {
      return DateTime.fromSeconds(Number(input));
    } else if (isNumber(input)) {
      return DateTime.fromMillis(Number(input))
    } else if (DateTime.fromFormat(input,'yyyy/MM/dd HH:mm:ss').isValid) {
      return DateTime.fromFormat(input,'yyyy/MM/dd HH:mm:ss', { zone: timeZone.toString() });
    } else if (DateTime.fromRFC2822(input).isValid) {
      return DateTime.fromRFC2822(input);
    } else if (DateTime.fromISO(input).isValid) {
      return DateTime.fromISO(input);
    } else if (isMongoObjectId(input)) {
      let unixtime = objectIdToUnixTime(input);
      if (unixtime !== null) {
        return DateTime.fromSeconds(unixtime);
      }
    }
    return null;
  }

  const handleChangeTimeZone = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeZone(e.target.value);
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  function createData(
    title: string,
    dateTimeValue: string,
  ) {
    return {title, dateTimeValue,};
  }

  function createRows() {
    return [
      createData('日本表記', dateTime.toFormat('yyyy/MM/dd HH:mm:ss')),
      createData('ISO 8601 拡張形式(JST)', dateTime.toISO() ?? ""),
      createData('ISO 8601 拡張形式(UTC)', dateTime.setZone("utc").toISO() ?? ""),
      createData('RFC 2822', dateTime.toRFC2822() ?? ""),
      createData('Unix timestamps', dateTime.toUnixInteger().toString()),
      createData('ObjectId', unixTimeToObjectId(dateTime.toUnixInteger())),
    ];
  }
  return (
    <>
      <Box component="h2">日付相互変換ツール</Box>
      <Typography paragraph>
        対応する日付形式を相互変換するツールです。
      </Typography>
      <Grid item xs={12} container sx={{marginY: 2}} spacing={1}>
        {/* 右側の入力フィールド */}
        <Grid item xs={9}>
          <TextField label="日付形式を入力してください"
            fullWidth onChange={handleChangeText}
            helperText={dateTimeError ? "日付の解析に失敗しました。" : ""}
            error={dateTimeError} />
        </Grid>

        {/* 右側のプルダウンメニュー */}
        <Grid item xs={3}>
          <TextField select label="TimeZone" fullWidth defaultValue={timeZone} onChange={handleChangeTimeZone}>
            {timeZoneList().map(m => <MenuItem value={m}>{m}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>
      <FormControl fullWidth>
        <Button variant="contained" onClick={handleConvert} >日時変換</Button>
      </FormControl>
      <TableContainer component={Paper} sx={{marginTop: 5}}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{backgroundColor: "#1976d2"}} >
              <TableCell sx={{ width: '35%', color: "white" }}>日付形式</TableCell>
              <TableCell sx={{ width: '65%', color: "white"}}>日時</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {createRows().map((row) =>
            <TableRow
              key={row.title}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell component="td" scope="row" sx={{fontSize: 18}}>
                {row.title}
              </TableCell>
              <TableCell align="left" sx={{fontSize: 18}}>
                <Tooltip title="Copy to Clipboard" placement="top" arrow>
                  <IconButton color="primary" size="small" onClick={() => copyToClipboard(row.dateTimeValue)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {row.dateTimeValue}
              </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

    </>
  );
}

export default DateTimeConverter;
