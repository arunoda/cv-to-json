<?php

$url = "http://localhost:11111";
$pdf_file_name = "./one.pdf";
$fields = "date of birth, gender";

$pdf_file = fopen($pdf_file_name, "rb");

$curl = curl_init();
curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 2);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_BINARYTRANSFER, 1);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array("x-extract-fields: " . $fields));


curl_setopt($curl, CURLOPT_PUT, 1);
curl_setopt($curl, CURLOPT_INFILE, $pdf_file);
curl_setopt($curl, CURLOPT_INFILESIZE, filesize($pdf_file_name));

$result = curl_exec($curl);
curl_close($curl); 

echo $result;