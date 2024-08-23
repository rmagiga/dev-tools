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
import {
  createDateConversion,
  ConversionType,
  ConversionTypeValues,
  timeZoneList,
  unixTimeToObjectId,
} from "../services/DateTimeService";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function DateTimeConverter() {
  const initDateTime = DateTime.fromSeconds(DateTime.now().toUnixInteger());
  const [dateTime, setDateTime] = useState<DateTime>(initDateTime);
  const [timeZone, setTimeZone] = useState<string>("Asia/Tokyo");
  const [dateTimeValue, setDateTimeValue] = useState<string>(
    initDateTime.toFormat("yyyy/MM/dd HH:mm:ss")
  );
  const [dateTimeError, setDateTimeError] = useState(false);
  const [inputType, setInputType] = useState<number>(0);

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setDateTimeValue(e.target.value);
  };

  const handleConvert = () => {
    let value = dateTimeValue.toString();
    let conversionType: ConversionTypeValues =
      inputType as ConversionTypeValues;
    const result = createDateConversion(value, conversionType, timeZone);

    if (result.isOk()) {
      let dateTime = result.value;
      setDateTimeError(false);
      setDateTime(dateTime);
    } else {
      setDateTimeError(true);
    }
  };

  const handleChangeTimeZone = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeZone(e.target.value);
  };

  const handleChangeInputType = (e: ChangeEvent<HTMLInputElement>) => {
    setInputType(parseInt(e.target.value));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  function createData(title: string, dateTimeValue: string) {
    return { title, dateTimeValue };
  }

  function createRows() {
    return [
      createData("日本表記", dateTime.toFormat("yyyy/MM/dd HH:mm:ss")),
      createData("ISO 8601 拡張形式(JST)", dateTime.toISO() ?? ""),
      createData(
        "ISO 8601 拡張形式(UTC)",
        dateTime.setZone("utc").toISO() ?? ""
      ),
      createData("RFC 2822", dateTime.toRFC2822() ?? ""),
      createData("Unix timestamps (秒)", dateTime.toUnixInteger().toString()),
      createData("Unix timestamps (ミリ秒)", dateTime.toMillis().toString()),
      createData(
        "ObjectId (MongoDB)",
        unixTimeToObjectId(dateTime.toUnixInteger())
      ),
    ];
  }
  const inputTypes = [
    {
      name: "自動",
      value: ConversionType.AUTO,
    },
    {
      name: "日本表記",
      value: ConversionType.JP_FORMAT,
    },
    {
      name: "ISO 8601",
      value: ConversionType.ISO8601_EXTENDED,
    },
    {
      name: "RFC 2822",
      value: ConversionType.RFC2822,
    },
    {
      name: "Unix timestamps seconds",
      value: ConversionType.UNIXTIME_SECONDS,
    },
    {
      name: "Unix timestamps milliseconds",
      value: ConversionType.UNIXTIME_SECONDS,
    },
    {
      name: "ObjectId",
      value: ConversionType.OBJECT_ID,
    },
  ];
  {
    /* レンダリング */
  }
  return (
    <>
      <Box component="h2">日付相互変換ツール</Box>

      <Typography paragraph>
        対応する日付形式を相互変換するツールです。
      </Typography>

      <Grid item xs={12} container sx={{ marginY: 2 }} spacing={1}>
        <Grid item xs={2}>
          <TextField
            select
            InputLabelProps={{ htmlFor: "inputDateType" }}
            InputProps={{ id: "inputDateType" }}
            label="入力日付形式"
            fullWidth
            defaultValue={inputType}
            onChange={handleChangeInputType}
          >
            {inputTypes.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={7}>
          <TextField
            id="inputDateText"
            label="日付を入力してください"
            fullWidth
            onChange={handleChangeText}
            helperText={dateTimeError ? "日付の解析に失敗しました。" : ""}
            error={dateTimeError}
            defaultValue={dateTimeValue}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            select
            InputLabelProps={{ htmlFor: "inputTimeZone" }}
            InputProps={{ id: "inputTimeZone" }}
            label="TimeZone"
            fullWidth
            defaultValue={timeZone}
            onChange={handleChangeTimeZone}
          >
            {timeZoneList().map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <FormControl fullWidth>
        <Button variant="contained" onClick={handleConvert}>
          日時変換
        </Button>
      </FormControl>

      <TableContainer component={Paper} sx={{ marginTop: 5 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ width: "35%", color: "white" }}>
                日付形式
              </TableCell>
              <TableCell sx={{ width: "65%", color: "white" }}>日時</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {createRows().map((row) => (
              <TableRow
                key={row.title}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="td" scope="row" sx={{ fontSize: 18 }}>
                  {row.title}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: 18 }}>
                  <Tooltip title="Copy to Clipboard" placement="top" arrow>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => copyToClipboard(row.dateTimeValue)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {row.dateTimeValue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default DateTimeConverter;
