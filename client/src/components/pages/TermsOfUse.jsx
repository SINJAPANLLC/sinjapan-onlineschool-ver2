import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfUse = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                            data-testid="button-back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <FileText className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">利用規約</h1>
                                <p className="text-sm text-blue-100">Terms of Service</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 max-w-4xl mx-auto pb-8"
            >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                    <h1 className="text-3xl font-bold text-blue-600 mb-6">
                        SIN JAPAN ONLINE SCHOOL 利用規約
                    </h1>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        合同会社SIN JAPAN KANAGAWA（以下「当社」といいます。）は、当社が運営するオンライン学習プラットフォーム「SIN JAPAN ONLINE SCHOOL」（以下「本サービス」といいます。）の利用について、以下のとおり規約（以下「本規約」といいます。）を定めます。本規約は、当社とすべての利用者との間に適用されます。
                    </p>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第１章 総則</h2>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">第１条（定義）</h3>

                    <p className="text-gray-700 leading-relaxed mb-4">
                        本規約では、以下のとおり用語を定義します。
                    </p>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            <strong className="text-blue-600">「本サービス」</strong><br />
                            当社が運営するオンライン学習プラットフォーム「SIN JAPAN ONLINE SCHOOL」をいいます。
                        </li>
                        <li>
                            <strong className="text-blue-600">「利用者」</strong><br />
                            本サービスを利用する個人をいいます。
                        </li>
                        <li>
                            <strong className="text-blue-600">「学生」</strong><br />
                            本規約に定める会員登録手続きを完了し、コースを受講する利用者をいいます。
                        </li>
                        <li>
                            <strong className="text-blue-600">「講師」</strong><br />
                            本規約に定める講師登録手続きを完了し、コースを提供する利用者をいいます。
                        </li>
                        <li>
                            <strong className="text-blue-600">「コース」</strong><br />
                            講師が学生に提供する学習コンテンツ（動画、テキスト、課題等）をいいます。
                        </li>
                        <li>
                            <strong className="text-blue-600">「受講料」</strong><br />
                            学生が講師に対し支払うコース利用料をいいます。
                        </li>
                    </ol>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">第２条（本規約への同意）</h3>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            利用者は、本規約に同意した上で、本サービスを利用するものとします。
                        </li>
                        <li>
                            利用者が本サービスを利用した場合、本規約に同意したものとみなします。
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第２章 アカウント登録</h2>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">第３条（アカウント登録）</h3>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            本サービスの利用を希望する者は、本規約に同意の上、当社が定める方法によりアカウント登録を申請するものとします。
                        </li>
                        <li>
                            当社は、登録申請者が以下のいずれかに該当する場合、登録を拒否することがあります。
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>本規約に違反するおそれがあると当社が判断した場合</li>
                                <li>虚偽の情報を提供した場合</li>
                                <li>過去に本規約違反等により登録を抹消されたことがある場合</li>
                            </ul>
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第３章 サービスの利用</h2>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">第４条（コースの提供と受講）</h3>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            講師は、当社が定める基準に従い、コースを作成し提供することができます。
                        </li>
                        <li>
                            学生は、講師が提供するコースを受講することができます。
                        </li>
                        <li>
                            コースの内容、品質については、講師が責任を負うものとします。
                        </li>
                    </ol>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">第５条（受講料の支払い）</h3>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            学生は、コースの受講にあたり、講師が定める受講料を支払うものとします。
                        </li>
                        <li>
                            受講料の支払い方法は、当社が定める方法によるものとします。
                        </li>
                        <li>
                            一度支払われた受講料は、原則として返金されません。
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第４章 禁止事項</h2>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">第６条（禁止事項）</h3>

                    <p className="text-gray-700 mb-4">利用者は、以下の行為を行ってはなりません。</p>

                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                        <li>法令または公序良俗に違反する行為</li>
                        <li>犯罪行為に関連する行為</li>
                        <li>当社または第三者の知的財産権を侵害する行為</li>
                        <li>他の利用者または第三者に不利益、損害を与える行為</li>
                        <li>本サービスの運営を妨害する行為</li>
                        <li>虚偽の情報を提供する行為</li>
                        <li>その他、当社が不適切と判断する行為</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第５章 その他</h2>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">第７条（本規約の変更）</h3>

                    <p className="text-gray-700 mb-8">
                        当社は、必要に応じて本規約を変更することができます。変更後の規約は、本サービス上に掲載した時点から効力を生じるものとします。
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">第８条（準拠法・管轄裁判所）</h3>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            本規約の解釈にあたっては、日本法を準拠法とします。
                        </li>
                        <li>
                            本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                        </li>
                    </ol>

                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-600 font-medium">
                            2025年1月1日 制定
                        </p>
                        <p className="text-gray-600 mt-2">
                            合同会社SIN JAPAN KANAGAWA
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsOfUse;
