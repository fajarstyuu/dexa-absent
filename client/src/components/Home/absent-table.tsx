import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyAbsents } from "@/modules/absents/absents";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";

export function AbsentTableHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [absensi, setAbsensi] = useState(null);

  useEffect(() => {
    async function getMyAbsent() {
      setIsLoading(true);
      try {
        const res = await getMyAbsents({
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
            date: "",
        });
        setAbsensi(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getMyAbsent();
  }, []);
  return (
    <Table className="w-full text-left">
      <TableCaption>Tekan untuk melihat seluruh riwayat absensi</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Check In</TableHead>
          <TableHead>Check Out</TableHead>
          <TableHead>Gambar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { isLoading ? 
          <TableRow><TableCell colSpan={5} className="text-center"><Spinner /></TableCell></TableRow> :  
          !absensi || absensi.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center">Tidak ada data</TableCell></TableRow> :  
          absensi?.map((absen: any, index: number) => (
          <TableRow key={absen.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{absen.date}</TableCell>
            <TableCell>{absen.checkIn}</TableCell>
            <TableCell>{absen.checkOut ?? "-"}</TableCell>
            <TableCell>
              <a href={absen.picturePath} target="_blank" rel="noopener noreferrer">
                <img className="h-12 w-12 object-cover cursor-pointer hover:opacity-80 transition-opacity rounded-md" src={absen.picturePath} alt="Bukti Absen" />
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
