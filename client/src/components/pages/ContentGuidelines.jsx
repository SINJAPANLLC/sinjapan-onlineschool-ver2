import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, BookOpen, AlertTriangle, CheckCircle, XCircle, Users, Award } from 'lucide-react';

const ContentGuidelines = () => {
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
                                <Shield className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">コンテンツガイドライン</h1>
                                <p className="text-sm text-blue-100">Content Guidelines</p>
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
                        SIN JAPAN ONLINE SCHOOL コンテンツガイドライン
                    </h1>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        SIN JAPAN ONLINE SCHOOLは、すべての学習者と講師にとって安全で質の高い学習環境を提供することを目指しています。
                        本ガイドラインは、講師がコースコンテンツを作成・公開する際に遵守すべき基準を定めています。
                    </p>

                    <div className="space-y-8">
                        {/* 基本理念 */}
                        <section>
                            <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                                <BookOpen className="w-7 h-7" />
                                基本理念
                            </h2>
                            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                        <span><strong>質の高い教育:</strong> すべてのコンテンツは教育的価値があり、学習者の成長を促進するものでなければなりません。</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                        <span><strong>安全な環境:</strong> 差別、ハラスメント、違法行為を含むコンテンツは禁止します。</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                        <span><strong>尊重と包摂性:</strong> すべての人種、性別、宗教、国籍、年齢、障がいの有無に関わらず尊重される環境を維持します。</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 許可されるコンテンツ */}
                        <section>
                            <h2 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-7 h-7" />
                                許可されるコンテンツ
                            </h2>
                            <div className="space-y-4">
                                <div className="border-l-4 border-green-500 pl-6 py-3 bg-green-50 rounded-r-xl">
                                    <h3 className="font-bold text-gray-800 mb-2">✓ 教育的コンテンツ</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>プログラミング、デザイン、ビジネススキルなどの専門知識</li>
                                        <li>語学学習、資格試験対策</li>
                                        <li>芸術、音楽、創作活動に関する指導</li>
                                        <li>健康、フィットネス、ウェルネス</li>
                                        <li>趣味、ライフスキル、自己啓発</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-green-500 pl-6 py-3 bg-green-50 rounded-r-xl">
                                    <h3 className="font-bold text-gray-800 mb-2">✓ 適切な教材形式</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>講義動画、プレゼンテーション</li>
                                        <li>テキスト教材、PDF資料</li>
                                        <li>実践課題、クイズ、テスト</li>
                                        <li>サンプルコード、テンプレート</li>
                                        <li>参考資料、リソースリンク</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 禁止事項 */}
                        <section>
                            <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                                <XCircle className="w-7 h-7" />
                                禁止されるコンテンツ
                            </h2>
                            <div className="space-y-3">
                                <div className="border-l-4 border-red-500 pl-6 py-3 bg-red-50 rounded-r-xl">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        違法コンテンツ
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>著作権、商標権、特許権などの知的財産権を侵害するコンテンツ</li>
                                        <li>違法薬物、武器、爆発物の製造・使用方法</li>
                                        <li>ハッキング、クラッキング、不正アクセスの指南</li>
                                        <li>マネーロンダリング、詐欺行為の方法</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-red-500 pl-6 py-3 bg-red-50 rounded-r-xl">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        有害・不適切なコンテンツ
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>性的・わいせつなコンテンツ</li>
                                        <li>暴力的、グロテスク、残虐なコンテンツ</li>
                                        <li>差別、ヘイトスピーチ、ハラスメント</li>
                                        <li>自殺、自傷行為を助長するコンテンツ</li>
                                        <li>虐待、いじめを描写または助長するコンテンツ</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-red-500 pl-6 py-3 bg-red-50 rounded-r-xl">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        不正行為
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>虚偽の情報、誇大広告、詐欺的なコンテンツ</li>
                                        <li>無断で他者の個人情報を公開する行為</li>
                                        <li>スパム、マルウェア、フィッシング</li>
                                        <li>ねずみ講、マルチ商法、投資詐欺の勧誘</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* コンテンツ品質基準 */}
                        <section>
                            <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                                <Award className="w-7 h-7" />
                                コンテンツ品質基準
                            </h2>
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-6 py-3">
                                    <h3 className="font-bold text-gray-800 mb-2">1. 技術的品質</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>動画は720p以上の解像度を推奨</li>
                                        <li>音声は明瞭で、ノイズが少ないこと</li>
                                        <li>字幕やテキストは読みやすいフォントとサイズを使用</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-blue-500 pl-6 py-3">
                                    <h3 className="font-bold text-gray-800 mb-2">2. 教育的品質</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>明確な学習目標と成果を提示</li>
                                        <li>体系的で論理的な構成</li>
                                        <li>実践的な例題や演習を含む</li>
                                        <li>初心者にも理解しやすい説明</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-blue-500 pl-6 py-3">
                                    <h3 className="font-bold text-gray-800 mb-2">3. コース構成</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>適切なセクション分けとレッスン構成</li>
                                        <li>1レッスンは5〜20分程度を推奨</li>
                                        <li>明確なコース説明と目次</li>
                                        <li>必要な前提知識や対象レベルの明示</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 講師の責任 */}
                        <section>
                            <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                                <Users className="w-7 h-7" />
                                講師の責任
                            </h2>
                            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <span className="font-bold text-blue-600 min-w-[24px]">•</span>
                                        <span>コンテンツの正確性と最新性を維持する責任</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="font-bold text-blue-600 min-w-[24px]">•</span>
                                        <span>学習者からの質問に誠実に対応する</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="font-bold text-blue-600 min-w-[24px]">•</span>
                                        <span>著作権や引用元を適切に表示する</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="font-bold text-blue-600 min-w-[24px]">•</span>
                                        <span>コース内容の重大な変更がある場合、受講者に通知する</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="font-bold text-blue-600 min-w-[24px]">•</span>
                                        <span>学習者のプライバシーと個人情報を保護する</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 違反への対応 */}
                        <section>
                            <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-7 h-7" />
                                ガイドライン違反への対応
                            </h2>
                            <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                                <p className="text-gray-700 mb-4">
                                    本ガイドラインに違反するコンテンツが発見された場合、以下の措置を講じる場合があります：
                                </p>
                                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                                    <li><strong>警告:</strong> 初回違反の場合、改善を求める警告を発します</li>
                                    <li><strong>コンテンツの削除:</strong> 違反コンテンツの即時削除</li>
                                    <li><strong>一時停止:</strong> 講師アカウントの一時停止（7〜30日間）</li>
                                    <li><strong>永久停止:</strong> 重大な違反または繰り返し違反の場合、アカウントの永久停止</li>
                                    <li><strong>法的措置:</strong> 違法行為の場合、関係当局への通報</li>
                                </ol>
                            </div>
                        </section>

                        {/* 報告方法 */}
                        <section>
                            <h2 className="text-2xl font-bold text-blue-600 mb-4">不適切なコンテンツの報告</h2>
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <p className="text-gray-700 mb-3">
                                    ガイドラインに違反すると思われるコンテンツを発見した場合は、以下の方法でご報告ください：
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>各コースページの「報告」ボタンから通報</li>
                                    <li>カスタマーサポート（<a href="mailto:info@sinjapan.jp" className="text-blue-600 hover:underline">info@sinjapan.jp</a>）までメール</li>
                                </ul>
                                <p className="text-sm text-gray-500 mt-4">
                                    ※すべての報告は慎重に審査され、必要に応じて適切な措置を講じます。<br />
                                    ※虚偽の報告や悪意のある報告は、報告者のアカウント停止につながる場合があります。
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-gray-600 text-center mb-4">
                            本ガイドラインは予告なく変更される場合があります。<br />
                            最新版は常に本ページに掲載されます。
                        </p>
                        <div className="text-center">
                            <p className="text-gray-600 font-medium">
                                最終更新: 2025年1月1日
                            </p>
                            <p className="text-gray-600 mt-2">
                                合同会社SIN JAPAN
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ContentGuidelines;
