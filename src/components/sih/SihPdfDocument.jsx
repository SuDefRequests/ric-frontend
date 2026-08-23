import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#111827',
  },
  headerBox: {
    textAlign: 'center',
    marginBottom: 12,
    borderBottom: '1.5pt solid #7a1620',
    paddingBottom: 8,
  },
  collegeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7a1620',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  formTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginTop: 3,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    padding: 4,
    marginTop: 8,
    marginBottom: 4,
    borderLeft: '3pt solid #7a1620',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#9ca3af',
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellLabel: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#9ca3af',
    padding: 4,
    fontWeight: 'bold',
    backgroundColor: '#fafafa',
  },
  tableCellValue: {
    width: '70%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#9ca3af',
    padding: 4,
  },
  memberHeaderCell: {
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#9ca3af',
    padding: 3,
    fontWeight: 'bold',
    backgroundColor: '#f9fafb',
    textAlign: 'center',
    fontSize: 8,
  },
  memberCell: {
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#9ca3af',
    padding: 3,
    textAlign: 'center',
    fontSize: 8,
  },
  declarationText: {
    fontSize: 7.5,
    lineHeight: 1.3,
    textAlign: 'justify',
    marginTop: 6,
    color: '#374151',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 10,
  },
  sigBox: {
    width: '23%',
    textAlign: 'center',
    borderTop: '0.8pt dotted #4b5563',
    paddingTop: 4,
    fontSize: 7.5,
  },
});

export const SihPdfDocument = ({ data = {} }) => {
  const safeData = data || {};
  const teamDetails = safeData.teamDetails || safeData || {};
  const members = Array.isArray(safeData.members) && safeData.members.length > 0 
    ? safeData.members 
    : Array(6).fill({ name: '', roll_no: '', branch: '', year: '', email: '', phone: '', gender: '' });
  
  const leaderDetails = safeData.leaderDetails || members[0] || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.collegeTitle}>
            Loknete Gopinathji Munde Institute of Engineering Education and Research, Nashik
          </Text>
          <Text style={styles.subTitle}>
            Internal Hackathon — Smart India Hackathon (SIH) 2026
          </Text>
          <Text style={styles.formTitle}>Student Team Registration Form</Text>
        </View>

        {/* 1. Team & Event Details */}
        <Text style={styles.sectionHeader}>1. Team & Event Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Department</Text>
            <Text style={styles.tableCellValue}>{teamDetails.department || '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Team Name</Text>
            <Text style={styles.tableCellValue}>{teamDetails.teamName || '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Edition</Text>
            <Text style={styles.tableCellValue}>{teamDetails.edition || '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Problem Statement Title / ID</Text>
            <Text style={styles.tableCellValue}>
              {teamDetails.psId ? `[${teamDetails.psId}] ` : ''}{teamDetails.psTitle || '-'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Category / Theme</Text>
            <Text style={styles.tableCellValue}>{teamDetails.category || '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Faculty Mentor Name</Text>
            <Text style={styles.tableCellValue}>{teamDetails.mentorName || '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Mentor Contact & Email</Text>
            <Text style={styles.tableCellValue}>
              {teamDetails.mentorContact ? `${teamDetails.mentorContact} | ` : ''}{teamDetails.mentorEmail || '-'}
            </Text>
          </View>
        </View>

        {/* 2. Team Leader Details */}
        <Text style={styles.sectionHeader}>2. Team Leader Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Name & Gender</Text>
            <Text style={styles.tableCellValue}>{leaderDetails.name || '-'} ({leaderDetails.gender || '-'})</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Branch & Year</Text>
            <Text style={styles.tableCellValue}>{leaderDetails.branch || '-'} • {leaderDetails.year || '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Roll / Enrollment No.</Text>
            <Text style={styles.tableCellValue}>{leaderDetails.rollNo || leaderDetails.roll_no || '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Contact & Email</Text>
            <Text style={styles.tableCellValue}>{leaderDetails.contact || leaderDetails.phone || leaderDetails.mobile_no || '-'} | {leaderDetails.email || '-'}</Text>
          </View>
        </View>

        {/* 3. Team Members Table */}
        <Text style={styles.sectionHeader}>
          3. Team Members (6 Members including Leader; ≥1 Female Mandatory)
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.memberHeaderCell, { width: '6%' }]}>S.N</Text>
            <Text style={[styles.memberHeaderCell, { width: '26%' }]}>Full Name</Text>
            <Text style={[styles.memberHeaderCell, { width: '16%' }]}>Branch & Year</Text>
            <Text style={[styles.memberHeaderCell, { width: '12%' }]}>Roll No</Text>
            <Text style={[styles.memberHeaderCell, { width: '8%' }]}>Gender</Text>
            <Text style={[styles.memberHeaderCell, { width: '16%' }]}>Contact</Text>
            <Text style={[styles.memberHeaderCell, { width: '16%' }]}>Email</Text>
          </View>
          {members.map((m, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={[styles.memberCell, { width: '6%' }]}>{idx + 1}</Text>
              <Text style={[styles.memberCell, { width: '26%', textAlign: 'left', paddingLeft: 2 }]}>
                {m?.name || '-'} {idx === 0 ? '(Leader)' : ''}
              </Text>
              <Text style={[styles.memberCell, { width: '16%' }]}>{m?.branch ? `${m.branch} ${m.year || ''}` : '-'}</Text>
              <Text style={[styles.memberCell, { width: '12%' }]}>{m?.rollNo || m?.roll_no || '-'}</Text>
              <Text style={[styles.memberCell, { width: '8%' }]}>{m?.gender || '-'}</Text>
              <Text style={[styles.memberCell, { width: '16%' }]}>{m?.contact || m?.phone || m?.mobile_no || '-'}</Text>
              <Text style={[styles.memberCell, { width: '16%', fontSize: 7 }]}>{m?.email || '-'}</Text>
            </View>
          ))}
        </View>

        {/* 4. Declaration */}
        <Text style={styles.sectionHeader}>4. Declaration</Text>
        <Text style={styles.declarationText}>
          We hereby declare that all the information provided above is true to the best of our knowledge. All team members belong to Loknete Gopinathji Munde Institute of Engineering Education and Research, Nashik and have not been included in any other team for the Internal Hackathon SIH-2026. We agree to abide by the rules and guidelines of the Internal Hackathon and Smart India Hackathon (SIH) 2026.
        </Text>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.sigBox}><Text>Signature of Team Leader</Text></View>
          <View style={styles.sigBox}><Text>Signature of Faculty Mentor</Text></View>
          <View style={styles.sigBox}><Text>Signature / Seal of HOD</Text></View>
          <View style={styles.sigBox}><Text>Date</Text></View>
        </View>
      </Page>
    </Document>
  );
};