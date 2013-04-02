<?php 
	$info='<table width="100%" border="0">
				  <tr>
					<td width="100%" align="right">'.$logo.'</td>
				 </tr>
			</table>			
			<table border="0" cellpadding="2" cellspacing="0" width="100%">
				<thead>
				'.$this->Html->tableHeaders($columnas,array("bgcolor"=>"#036","color"=>"white")).'
				</thead>
				<tbody>'.$this->Html->tableCells($filas,array("bgcolor"=>"#DFEFFF")).'
				</tbody>
				<tfoot>
				<tr>
				<td colspan="2">'.__('Total de Registros [',true). count($filas).']
				</td>
				</tr>
				<tfoot>
			</table>';
	ob_end_clean();		
	App::import('Vendor','/tcpdf/pdfreporte');  		
	$pdf = new PdfReporte(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
	$pdf->titulo="Reporte General de Perfiles";
	$pdf->AddPage();
	$pdf->SetFont('helvetica', '', 8);	
	$pdf->writeHTML($info, true, false, true, false, '');
	$pdf->Output('reporte'.rand(1,1000).'.pdf', 'I');
?>