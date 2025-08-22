import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dropzone } from '@/components/dropzone';
import { StatementsList } from '@/components/statements-list';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Bank Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Upload your bank statement file (PDF, CSV, XLSX). The file will be processed securely.
          </p>
          <Dropzone />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processing History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* This would be a server component fetching data */}
          <StatementsList />
        </CardContent>
      </Card>
    </div>
  );
}
