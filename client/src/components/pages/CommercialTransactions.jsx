import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Building2, Mail, Phone, MapPin } from 'lucide-react';

const CommercialTransactions = () => {
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
                                <h1 className="text-2xl font-bold">特定商取引法に基づく表記</h1>
                                <p className="text-sm text-blue-100">Specified Commercial Transaction Act</p>
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
                        特定商取引法に基づく表記
                    </h1>

                    <div className="space-y-6">
                        {/* 販売業者 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-blue-600" />
                                販売業者
                            </h2>
                            <p className="text-gray-700 text-lg font-semibold">合同会社SIN JAPAN</p>
                        </div>

                        {/* 運営統括責任者 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">運営統括責任者</h2>
                            <p className="text-gray-700">代表社員 [責任者名]</p>
                        </div>

                        {/* 所在地 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-blue-600" />
                                所在地
                            </h2>
                            <p className="text-gray-700">
                                〒[郵便番号]<br />
                                [都道府県][市区町村][番地]
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                ※お客様からのお問い合わせは、メールにて承っております。
                            </p>
                        </div>

                        {/* お問い合わせ */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Mail className="w-6 h-6 text-blue-600" />
                                お問い合わせ
                            </h2>
                            <p className="text-gray-700">
                                メールアドレス: <a href="mailto:info@sinjapan.jp" className="text-blue-600 hover:underline">info@sinjapan.jp</a>
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                お問い合わせは、上記メールアドレスまでお願いいたします。<br />
                                営業時間: 平日 10:00〜18:00（土日祝日を除く）
                            </p>
                        </div>

                        {/* 販売価格 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">販売価格</h2>
                            <p className="text-gray-700">
                                各コースページに表示された金額（税込）<br />
                                ※価格は予告なく変更される場合がございます。
                            </p>
                        </div>

                        {/* 商品代金以外の必要料金 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">商品代金以外の必要料金</h2>
                            <p className="text-gray-700">
                                ・インターネット接続料金<br />
                                ・通信料金（お客様のインターネット接続環境により異なります）
                            </p>
                        </div>

                        {/* お支払方法 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">お支払方法</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>クレジットカード決済（Visa、Mastercard、JCB、American Express、Diners Club）</li>
                                <li>デビットカード決済</li>
                                <li>その他、当サービスが指定する決済方法</li>
                            </ul>
                        </div>

                        {/* お支払時期 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">お支払時期</h2>
                            <p className="text-gray-700">
                                コース受講申込時に決済が完了いたします。<br />
                                クレジットカードの引き落とし時期は、各カード会社の規約に準じます。
                            </p>
                        </div>

                        {/* サービスの提供時期 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">サービスの提供時期</h2>
                            <p className="text-gray-700">
                                決済完了後、直ちにコース受講が可能となります。
                            </p>
                        </div>

                        {/* 返品・キャンセルについて */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">返品・キャンセルについて</h2>
                            <p className="text-gray-700 mb-3">
                                デジタルコンテンツという商品の性質上、以下の場合を除き、原則として返金・キャンセルはお受けできません。
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">返金対象となる場合：</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>当社の責めに帰すべき事由により、サービスの提供が不可能となった場合</li>
                                    <li>コンテンツに重大な瑕疵があり、サービスとして成立しない場合</li>
                                    <li>誤って重複購入した場合（購入後7日以内のご連絡に限る）</li>
                                </ul>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">
                                ※返金をご希望の場合は、お問い合わせフォームよりご連絡ください。<br />
                                ※審査の結果、返金をお断りする場合もございます。
                            </p>
                        </div>

                        {/* 動作環境 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">動作環境</h2>
                            <p className="text-gray-700 mb-3">
                                本サービスは以下の環境でご利用いただけます。
                            </p>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>推奨ブラウザ:</strong></p>
                                <ul className="list-disc list-inside ml-4">
                                    <li>Google Chrome（最新版）</li>
                                    <li>Mozilla Firefox（最新版）</li>
                                    <li>Safari（最新版）</li>
                                    <li>Microsoft Edge（最新版）</li>
                                </ul>
                                <p className="mt-3"><strong>インターネット接続:</strong></p>
                                <ul className="list-disc list-inside ml-4">
                                    <li>常時接続可能なブロードバンド回線</li>
                                    <li>推奨速度: 5Mbps以上</li>
                                </ul>
                            </div>
                        </div>

                        {/* 表現、及び商品に関する注意書き */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">表現、及び商品に関する注意書き</h2>
                            <p className="text-gray-700">
                                本サイトに掲載されているコースの効果や学習成果には個人差があります。<br />
                                必ずしも効果を保証するものではございません。
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-600 font-medium">
                            制定日: 2025年1月1日
                        </p>
                        <p className="text-gray-600 mt-2">
                            合同会社SIN JAPAN
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CommercialTransactions;
